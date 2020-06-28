const router = require('express').Router();
const { getUsers, getUserById, postUser } = require('../controllers/users'); // импорт методов из контроллера

router.get('/', getUsers); // вызываем метод
router.get('/:id', getUserById); // вызываем метод
router.post('/', postUser); // вызываем метод

module.exports = router;
