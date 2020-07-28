const bcrypt = require('bcryptjs'); // импорт модуля для создания хешей
const jwt = require('jsonwebtoken'); // импорт модуля для создания токенов
const User = require('../models/user'); // импорт схемы
const { cryptoKey } = require('../key'); // импорт ключа для зашифровки токена
const { NotFoundError, DoubleDataError } = require('../middlewares/errors');

// поиск всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// поиск пользователя по id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Такой пользователь не найден'); // создаем ошибку и переходим в обработчик ошибок
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

// создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 5)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) { next(new DoubleDataError('Пользователь с таким email уже существует')); }
      next(err);
    });
};

// обновление данных пользователя
// user._id получаем из токена после прохождения авторизации
module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Такой пользователь не найден'); // создаем ошибку и переходим в обработчик ошибок
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

// обновление аватара пользователя
// user._id получаем из токена после прохождения авторизации
module.exports.patchUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Такой пользователь не найден'); // создаем ошибку и переходим в обработчик ошибок
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

// авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, cryptoKey, { expiresIn: '7d' }); // создали токен
      res.send({ token });
    })
    .catch(next);
};
