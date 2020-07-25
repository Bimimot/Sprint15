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

const { errors } = require('celebrate'); // импорт мидлвэры обработки ошибок при валидации запросов
const { BadFormatError, ServerError } = require('./middlewares/errors'); // импорт конструкторов типовых ошибок
const cardsRouter = require('./routes/cards.js'); // импортируем роутер для карточек
const usersRouter = require('./routes/users.js'); // импортируем роутер для данных о пользователях
const { createUser, login } = require('./controllers/users'); // импорт методов авторизации из контроллера

app.use(bodyParser.json()); // для сборки JSON-формата

app.use('/users', usersRouter); // подключаем usersRouter
app.use('/cards', cardsRouter); // подключаем cardsRoute

app.post('/signin', login);
app.post('/signup', createUser);

app.use(errors()); // обработка ошибок celebrate

app.use((err, req, res, next) => { // обработка ошибок, сюда переходим из блока catch
  if (!err.statusCode) { // если ошибка пришла без кода
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      err = new BadFormatError('Данные переданы в неверном формате');
    } else {
      err = new ServerError('На сервере произошла ошибка');
    }
  }
  res.status(err.statusCode).send({ message: err.message });
});

app.use((req, res) => { // если запрос на несуществующую страницу
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log('Express server started on port', PORT); // eslint-disable-line no-console
}); // начинаем слушать заданный порт

//      const err = new BadFormatError('Данные переданы в неверном формате');
//      const err = new ServerError('На сервере произошла ошибка');