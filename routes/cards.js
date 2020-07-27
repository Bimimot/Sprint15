const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // подключаем библиотеку для валидации запросов
const urlRegex = require('url-regex'); // подключили регулярное выражение для валидации URL
const auth = require('../middlewares/auth'); // подключаем мидлвэру авторизации

const {
  getCards, postCard, delCard, likeCard, dislikeCard,
} = require('../controllers/cards'); // импорт методов из контроллера

router.use(auth); // вызываем авторизацию для всех методов ниже

router.get('/', getCards); // вызываем метод получения всех карточек

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .pattern(new RegExp(urlRegex().source)), // создаем чистое регулярное выражение без флагов
  }),
}), postCard); // вызываем метод добавлени карточки

router.delete('/:cardId', delCard); // вызываем метод удаления карточки
router.put('/:cardId/likes', likeCard); // вызываем метод устновки лайка
router.delete('/:cardId/likes', dislikeCard); // вызываем метод снятия лайка

module.exports = router;
