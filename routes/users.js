const router = require('express').Router();
const {
  getUsers, getUserById, createUser, patchUser, patchUserAvatar, login
} = require('../controllers/users'); // импорт методов из контроллера

router.get('/', getUsers); // вызываем метод получения всех пользователей
router.get('/:id', getUserById); // вызываем метод получения пользователя по id
router.patch('/me', patchUser); // вызываем метод обновления имени пользователя
router.patch('/me/avatar', patchUserAvatar); // вызываем метод обновления ссылки на аватар пользователя

router.post('/signin', login); // вызываем метод аторизации пользователя
router.post('/signup', createUser); // вызываем метод регистрации пользователя

module.exports = router;
