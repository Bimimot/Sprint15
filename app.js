const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
const path = require("path");                             //модуль ноды для работы с путями файлов
const fs = require("fs");                                 //модуль ноды для работы с файлами
const fsPromises = require('fs').promises;                //модуль ноды для работы с промисами



const usersPath = path.join(__dirname, 'data', 'users.json');     //собрали абсолютный путь к файлу users.json
const cardsPath = path.join(__dirname, 'data', 'cards.json');     //собрали абсолютный путь к файлу cards.json
const publicPath = path.join(__dirname, 'public');                //собрали абсолютный путь к папке public

app.use(express.static(publicPath));                             // доступ только к публичным файлам
app.listen(PORT);                                                //начинаем слушать заданный порт

app.get('/cards', (req, res) => {
  fsPromises.readFile(cardsPath, { encoding: 'utf8' })                //смотрим промис чтения файла
      .then((data) => {                                               //если успешно - возвращаем данные
          res.send(JSON.parse(data));
      })
      .catch(err => {                                                 //при ошибке - возвращаем ошибку
          res.send(err);
      });
});

app.get('/users', (req, res) => {
  fsPromises.readFile(usersPath, { encoding: 'utf8' })                //смотрим промис чтения файла
      .then((data) => {                                               //если успешно - возвращаем данные
          res.send(JSON.parse(data));
      })
      .catch(err => {                                                 //при ошибке - возвращаем ошибку
          res.send(err);
      });
});

app.get('/users/:id', (req, res) => {
  const{id} = req.params;                                         //запоминаем запрошенный id
  fsPromises.readFile(usersPath, { encoding: 'utf8' })                //смотрим промис чтения файла
  .then((data) => {                                               //если успешно - возвращаем данные
      const usersArr = JSON.parse(data);                          //собираем массив с данными пользователей
      for (i =0; i < usersArr.length; i++){                                // проходим по всему массиву
        if (usersArr[i]._id === id) {                          //если находим юзера с нужным id - выводим его данным
          res.send(usersArr[i]);
          return
        }
      };
  })
  .catch(err => {                                                 //при ошибке - возвращаем ошибку
      res.send(err);
  });
});

// function findUser(userId) {
//   fsPromises.readFile(usersPath, { encoding: 'utf8' })                //смотрим промис чтения файла
//   .then((data) => {                                               //если успешно - возвращаем данные
//       const usersArr = JSON.parse(data);                          //собираем массив с данными пользователей
//       for (i =0; i < usersArr.length; i++){                                // проходим по всему массиву
//         if (usersArr[i]._id === userId) {                          //если находим юзера с нужным id - выводим его данным
//           console.log(usersArr[i]);
//           return
//         }
//       };
//   })
//   .catch(err => {                                                 //при ошибке - возвращаем ошибку
//       console.log(err);
//   });
// };

// findUser('dbfe53c3c4d568240378b0c6');