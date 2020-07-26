require('dotenv').config();
const express = require('express'); // модуль ноды для http сервера
const mongoose = require('mongoose'); // модуль ноды для подключения сервера с базой данных
const bodyParser = require('body-parser'); // модуль ноды для парсинга пост-запросов в нужный (json) формат

const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { celebrate, Joi, errors } = require('celebrate'); // импорт обработки ошибок при валидации запросов
const { ServerError } = require('./middlewares/errors'); // импорт конструкторов типовых ошибок
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
    avatar: Joi.string().required().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

app.use(errorLogger); // подключаем логирование ошибок
app.use(errors()); // обработка ошибок celebrate при помощи мидлвэры celebrate
app.use((err, req, res, next) => { // обработка ошибок, сюда переходим из блока catch
  if (!err.statusCode) { // если ошибка пришла без кода - ставим ошибку сервера
    // eslint-disable-next-line no-param-reassign
    err = new ServerError('На сервере произошла ошибка');
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.use((req, res) => { // если запрос на несуществующую страницу
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log('Express server started on port', PORT); // eslint-disable-line no-console
}); // начинаем слушать заданный порт
