const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // подключаем библиотеку для валидации запросов
const validatorNpm = require('validator');

const auth = require('../middlewares/auth'); // подключаем мидлвэру авторизации
const { BadFormatError } = require('../middlewares/errors');

const {
  getUsers, getUserById, patchUser, patchUserAvatar,
} = require('../controllers/users'); // импорт методов из контроллера

router.use(auth); // вызываем авторизацию для всех методов идущих ниже

router.get('/', getUsers); // вызываем метод получения всех пользователей

router.get('/:id', celebrate({
  params: Joi.object().keys({ id: Joi.string().hex().length(24) }),
}), getUserById); // вызываем метод получения пользователя по id

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser); // вызываем метод обновления имени пользователя

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .custom((value) => {
        if (!validatorNpm.isURL(value)) {
          throw new BadFormatError('Это неправильная ссылка');
        } else { return value; }
      }),
  }),
}), patchUserAvatar); // вызываем метод обновления ссылки на аватар пользователя

module.exports = router;

// вариант с RegEx валидацией ссылок
// const urlRegex = require('url-regex'); // подключили регулярное выражение для валидации URL
// router.patch('/me/avatar', celebrate({
//   body: Joi.object().keys({
//     avatar: Joi.string().required()
//       .pattern(new RegExp(urlRegex().source)), // создаем чистое регулярное выражение без флагов
//   }),
// }), patchUserAvatar); // вызываем метод обновления ссылки на аватар