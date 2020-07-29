const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // подключаем библиотеку для валидации запросов

const validUrl = require('./valid'); // подключаем функцию проверки url
const auth = require('../middlewares/auth'); // подключаем мидлвэру авторизации

const {
  getCards, postCard, delCard, likeCard, dislikeCard,
} = require('../controllers/cards'); // импорт методов из контроллера

router.use(auth); // вызываем авторизацию для всех методов ниже

router.get('/', getCards); // вызываем метод получения всех карточек

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value) => validUrl(value)),
  }),
}), postCard); // вызываем метод добавлени карточки

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().hex().length(24) }),
}), delCard); // вызываем метод удаления карточки

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().hex().length(24) }),
}), likeCard); // вызываем метод установки лайка

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().hex().length(24) }),
}), dislikeCard); // вызываем метод снятия лайка

module.exports = router;
