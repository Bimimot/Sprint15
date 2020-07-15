// middlewares/auth.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация - нет авторизации типа Bearer' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация - токен не прошел проверку' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
