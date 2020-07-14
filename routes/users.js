const router = require('express').Router();
const {
  getUsers, getUserById, createUser, patchUser, patchUserAvatar,
} = require('../controllers/users'); // импорт методов из контроллера

router.get('/', getUsers); // вызываем метод
router.get('/:id', getUserById); // вызываем метод
router.post('/', createUser); // вызываем метод
router.patch('/me', patchUser); // вызываем метод
router.patch('/me/avatar', patchUserAvatar); // вызываем метод

module.exports = router;
