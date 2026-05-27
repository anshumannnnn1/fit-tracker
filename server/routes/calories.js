const router = require('express').Router();
const auth = require('../middleware/auth');
const Food = require('../models/Food');

router.get('/:date', auth, async (req, res) => {
  try {
    const foods = await Food.find({ user: req.user.id, date: req.params.date });
    res.json(foods);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const food = await Food.create({ ...req.body, user: req.user.id });
    res.json(food);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Food.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
