const validatorNpm = require('validator');
const { BadFormatError } = require('../middlewares/errors');

module.exports = (value) => {
  if (!validatorNpm.isURL(value)) {
    throw new BadFormatError('Это неправильная ссылка');
  } else { return value; }
};
