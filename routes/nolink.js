const router = require('express').Router();

router.get('/:link', (req, res) => {
  const { link } = req.params; // смотрим, какой адрес получили
  if (link.match(/^(cards)|(users(\/[a-z0-9]+)?)/i) === null) {
    res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  }
});

module.exports = router;
