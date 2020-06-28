const path = require('path'); // модуль ноды для работы с путями файлов
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

const cardsRouter = require('./routes/cards.js'); // импортируем роутер для карточек
const usersRouter = require('./routes/users.js'); // импортируем роутер для данных о пользователях
const nolinkRouter = require('./routes/nolink.js'); // импортируем роутер для неверных запросов

const publicPath = path.join(__dirname, 'public'); // собрали абсолютный путь к папке public

app.use(express.static(publicPath)); // доступ только к публичным файлам
app.use(bodyParser.json()); // для собирания JSON-формата

app.use((req, res, next) => { // хардкод для добавления id пользователя
  req.user = {
    _id: '5ef84bb4f4471d05c8f81aa2',
  };

  next();
});

app.use('/users', usersRouter); // подключаем usersRouter
app.use('/cards', cardsRouter); // подключаем cardsRouter
app.use('/', nolinkRouter); // подключаем nolinkRouter

app.listen(PORT); // начинаем слушать заданный порт
