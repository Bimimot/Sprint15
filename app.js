const path = require('path'); // модуль ноды для работы с путями файлов
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// const cardsRouter = require('./routes/cards.js'); // импортируем роутер для карточек
const usersRouter = require('./routes/users.js'); // импортируем роутер для данных о пользователях
const nolinkRouter = require('./routes/nolink.js'); // импортируем роутер для неверных запросов

const publicPath = path.join(__dirname, 'public'); // собрали абсолютный путь к папке public

app.use(express.static(publicPath)); // доступ только к публичным файлам
app.use(bodyParser.json()); // для собирания JSON-формата

app.use('/users', usersRouter); // подключаем usersRouter
// app.use('/', cardsRouter); // подключаем cardsRouter
app.use('/', nolinkRouter); // подключаем nolinkRouter

app.listen(PORT); // начинаем слушать заданный порт

// const cardSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 30,
//   },
//   link: {
//     type: String,
//     required: true,
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: user,
//     required: true,
//   },
//   likes: {
//     type: Array,
//     default: [],
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });


// module.exports = mongoose.model('card', cardSchema);