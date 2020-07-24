const Card = require('../models/card');
const { AccessDeniedError, NotFoundError } = require('../middlewares/errors');

// поиск всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// создание карточки
module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user; // берем id, полученный из милдверы авторизации
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// удаление карточки по id
module.exports.delCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = `${req.user._id}`;
  Card.findById(cardId)
    .then((card) => {
      if (card == null) {
        throw new NotFoundError('Карточка с таким id не найдена'); // создаем ошибку и переходим в обработчик ошибок
      } else {
        const cardOwner = `${card.owner}`; // приводим к одному типу для соблюдения стандарта линтера при использовании оператров сравнения
        if (userId === cardOwner) {
          Card.findByIdAndRemove(cardId)
            .then((mycard) => res.send({ message: 'Карточка удалена', data: mycard }))
            .catch(next);
        } else {
          throw new AccessDeniedError('Нет прав на удаление этой карточки');
        }
      }
    })
    .catch(next);
};

// поставить лайк карточки, сохранить id пользователя в массив лайков
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        throw new NotFoundError('Карточка с таким id не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};

// убрать лайк с карточки, убрать id пользователя из массива лайков
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }, // в ответе вернем новые данные
  )
    .then((card) => {
      if (card == null) {
        throw new NotFoundError('Карточка с таким id не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};
