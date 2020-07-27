const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // подключаем библиотеку для валидации запросов
const urlRegex = require('url-regex'); // подключили регулярное выражение для валидации URL
const auth = require('../middlewares/auth'); // подключаем мидлвэру авторизации

const {
  getUsers, getUserById, patchUser, patchUserAvatar,
} = require('../controllers/users'); // импорт методов из контроллера

router.use(auth); // вызываем авторизацию для всех методов идущих ниже

router.get('/', getUsers); // вызываем метод получения всех пользователей

router.get('/:id', celebrate({
  params: Joi.object().keys({ id: Joi.string().alphanum().length(24) }),
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
      .pattern(new RegExp(urlRegex().source)), // создаем чистое регулярное выражение без флагов
  }),
}), patchUserAvatar); // вызываем метод обновления ссылки на аватар пользователя

module.exports = router;

//    avatar: Joi.string().required().custom(validator.isURL(.....)),

// Joi.object({
//     password: Joi
//         .string()
//         .custom((value, helper) => {

//             if (value.length < 8) {
//                 return helper.message("Password must be at least 8 characters long")

//             } else {
//                 return true
//             }

//         })

// }).validate({
//     password: '1234'
// });

