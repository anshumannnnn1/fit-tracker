const router = require('express').Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

router.get('/:date', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id, date: req.params.date });
    res.json(workouts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    // ✅ Fixed: destructure only expected fields instead of spreading raw req.body
    const { date, name, duration, calories, notes } = req.body;
    if (!date || !name) return res.status(400).json({ message: 'date and name are required' });

    const workout = await Workout.create({ date, name, duration, calories, notes, user: req.user.id });
    res.json(workout);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;