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
    // ✅ Fixed: destructure only expected fields instead of spreading raw req.body
    const { date, name, calories, protein, carbs, fats } = req.body;
    if (!date || !name) return res.status(400).json({ message: 'date and name are required' });
    if (calories !== undefined && (isNaN(calories) || Number(calories) < 0))
      return res.status(400).json({ message: 'Invalid calories value' });

    const food = await Food.create({ date, name, calories, protein, carbs, fats, user: req.user.id });
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