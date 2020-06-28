const router = require('express').Router();
const { getCards, postCard, delCard } = require('../controllers/cards'); // импорт методов из контроллера

router.get('/', getCards); // вызываем метод
router.post('/', postCard); // вызываем метод
router.delete('/:id', delCard); // вызываем метод

module.exports = router;
