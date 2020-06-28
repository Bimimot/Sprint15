const Card = require('../models/card');

// поиск всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// создание карточки
module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // берем id, который жетско добавили в запрос
  Card.create({ name, link, owner })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// удаление карточки по id
module.exports.delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
