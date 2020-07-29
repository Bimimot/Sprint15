require('dotenv').config();
const express = require('express'); // модуль ноды для http сервера
const mongoose = require('mongoose'); // модуль ноды для подключения сервера с базой данных
const bodyParser = require('body-parser'); // модуль ноды для парсинга пост-запросов в нужный (json) формат
const validatorNpm = require('validator'); // валидатор для проверки URL в передаваемых запросах

const { NODE_ENV } = process.env;
const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// eslint-disable-next-line no-unused-vars
const { celebrate, Joi, errors } = require('celebrate'); // импорт обработки ошибок при валидации запросов
const { NotFoundError, ServerError, BadFormatError } = require('./middlewares/errors'); // импорт конструкторов типовых ошибок
const cardsRouter = require('./routes/cards.js'); // импортируем роутер для карточек
const usersRouter = require('./routes/users.js'); // импортируем роутер для данных о пользователях
const { createUser, login } = require('./controllers/users'); // импорт методов авторизации из контроллера
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json()); // подключаем сборку JSON-формата
app.use(requestLogger); // подключаем логирование запросов

app.use('/users', usersRouter); // подключаем usersRouter
app.use('/cards', cardsRouter); // подключаем cardsRoute

app.get('/crash-test', () => { // для проверки работы pm2
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', // подключаем контроллер авторизации
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login);

app.post('/signup', celebrate({ // подключаем контроллер регистрации
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required()
      .custom((value) => {
        if (!validatorNpm.isURL(value)) {
          throw new BadFormatError('Это неправильная ссылка');
        } else { return value; }
      }),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

app.use((req, res, next) => { // генерируем ошибку если запрос на несуществующую страницу
  next(new NotFoundError('Такой ресурс не найден'));
});

app.use(errorLogger); // подключаем логирование ошибок

// обработка ошибок, сюда переходим из блоков catch
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.joi || (err.name === 'CastError')
  || (err.name === 'ValidationError')
  || (err.name === 'MongoError')) {
    err = new BadFormatError( // eslint-disable-line no-param-reassign
      (NODE_ENV !== 'production') ? err : 'В запросе указаны неправильные данные', // для режима разработки возвращаем полный текст ошибки
    );
  }

  if (!err.statusCode) {
    err = new ServerError( // eslint-disable-line no-param-reassign
      (NODE_ENV !== 'production') ? err : 'На сервере произошла ошибка', // для режима разработки возвращаем полный текст ошибки
    );
  }
  return res.status(err.statusCode).send({ message: err.message, status: err.statusCode });
});

app.listen(PORT, () => {
  console.log('Express server started on port', PORT); // eslint-disable-line no-console
}); // начинаем слушать заданный порт
