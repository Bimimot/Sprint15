const mongoose = require('mongoose');

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
        return /^(https?:\/\/)(((www.)?([\w-]+(\.))+[a-z]{2,})|((25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[0-9]{2}|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[0-9]{2}|[0-9])){3}))(:\d{2,5})?(\/.?[\w-]+)*#?\/?((\..{2,})?)$/.test(text);
      },
      message: (props) => `${props.value} Это неправильная ссылка`,
    },
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
