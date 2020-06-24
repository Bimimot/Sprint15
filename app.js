const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, 'public'))); // доступ только к публичным файлам

app.listen(PORT);

app.get('/users', (req, res) => {
    res.send(animals[req.query.animal][req.query.type]);
});
