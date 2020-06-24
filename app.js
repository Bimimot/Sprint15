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

app.get('/users', (req, res) => {
  fsPromises.readFile(usersPath, { encoding: 'utf8' })                //смотрим промис чтения файла
      .then((data) => {                                               //если успешно - возвращаем данные
          res.send(JSON.parse(data));
      })
      .catch(err => {                                                 //при ошибке - возвращаем ошибку
          res.send(err);
      });
});

app.get('/cards', (req, res) => {
  fsPromises.readFile(cardsPath, { encoding: 'utf8' })                //смотрим промис чтения файла
      .then((data) => {                                               //если успешно - возвращаем данные
          res.send(JSON.parse(data));
      })
      .catch(err => {                                                 //при ошибке - возвращаем ошибку
          res.send(err);
      });
});
