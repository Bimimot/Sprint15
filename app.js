const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
const path = require("path");                             //модуль ноды для работы с путями файлов
const fs = require("fs");                                 //модуль ноды для работы с файлами
const fsPromises = require('fs').promises;                //модуль ноды для работы с промисами




app.use(express.static(path.join(__dirname, 'public'))); // доступ только к публичным файлам
app.listen(PORT);                                        //начинаем слушать заданный порт

app.get('/users', (req, res) => {
  fsPromises.readFile('./data/users.json', { encoding: 'utf8' })      //смотрим промис чтения файла
      .then((data) => {                                               //если успешно - возвращаем данные
          res.send(JSON.parse(data));
      })
      .catch(err => {                                                 //при ошибке - возвращаем ошибку
          res.send(err);
      });
});
