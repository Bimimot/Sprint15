const router = require('express').Router();

const path = require('path'); // модуль ноды для работы с путями файлов
const fsPromises = require('fs').promises; // модуль ноды для работы с промисами

const cardsPath = path.join(path.dirname(__dirname), 'data', 'cards.json'); // собрали абсолютный путь к файлу cards.json

router.get('/cards', (req, res) => {
  fsPromises.readFile(cardsPath, { encoding: 'utf8' }) // смотрим промис чтения файла
    .then((data) => { // если успешно - возвращаем данные
      res.send(JSON.parse(data));
    })
    .catch((err) => { // при ошибке - возвращаем ошибку
      res.send(err);
    });
});

module.exports = router;
