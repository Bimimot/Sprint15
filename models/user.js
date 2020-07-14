const mongoose = require('mongoose');
const validatorNpm = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator(text) {
        return (validatorNpm.isURL(text));
      },
      message: (props) => `${props.value} Это неправильная ссылка на фото для профиля`,
    },
    required: true,
  },
  email: {
    type: String,
    required: true,
    validator(text) {
      return (validatorNpm.isEmail(text));
    },
    message: (props) => `${props.value} Неверно указана электронная почта`,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
