const mongoose = require('mongoose');

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
        return /^(https?:\/\/)(((www.)?([\w-]+(\.))+[a-z]{2,})|((25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[0-9]{2}|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[0-9]{2}|[0-9])){3}))(:\d{2,5})?(\/.?[\w-]+)*#?\/?((\..{2,})?)$/.test(text);
      },
      message: (props) => `${props.value} Это неправильная ссылка`,
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
