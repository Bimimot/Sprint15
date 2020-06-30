const Card = require('../models/card');

// поиск всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// создание карточки
module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // берем id, который жетско добавили в запрос
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// удаление карточки по id
module.exports.delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card == null) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// поставить лайк карточки, сохранить id пользователя в массив лайков
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// убрать лайк с карточки, убрать id пользователя из массива лайков
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
