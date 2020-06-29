const mongoose = require('mongoose');
const validatorNpm = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator(text) {
        return (validatorNpm.isURL(text));
      },
      message: (props) => `${props.value} Это неправильная ссылка на фото для карточки`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // свойство из коллекции user
    ref: 'user',
    required: true,
  },
  likes: [{ // описываем схему для одного элемента и заключаем её в квадратные скобки
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: '',
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
