const router = require('express').Router();

const path = require('path'); // модуль ноды для работы с путями файлов
const fsPromises = require('fs').promises; // модуль ноды для работы с промисами

const usersPath = path.join(path.dirname(__dirname), 'data', 'users.json'); // собрали абсолютный путь к файлу users.json

router.get('/users', (req, res) => {
  fsPromises.readFile(usersPath, { encoding: 'utf8' }) // смотрим промис чтения файла
    .then((data) => { // если успешно - возвращаем данные
      res.send(JSON.parse(data));
    })
    .catch((err) => { // при ошибке - возвращаем ошибку
      res.send(err);
    });
});

router.get('/users/:id', (req, res) => {
  const { id } = req.params; // запоминаем запрошенный id
  fsPromises.readFile(usersPath, { encoding: 'utf8' }) // смотрим промис чтения файла
    .then((data) => { // если успешно - возвращаем данные
      const usersArr = JSON.parse(data); // собираем массив с данными пользователей
      for (let i = 0; i < usersArr.length; i += 1) { // проходим по всему массиву
        if (usersArr[i]._id === id) { // если находим юзера с нужным id - выводим его данным
          res.send(usersArr[i]);
          return;
        }
      }
      res.status(404).send({ message: 'Нет пользователя с таким id' });
    })
    .catch((err) => { // при ошибке - возвращаем ошибку
      res.send(err);
    });
});

module.exports = router;
