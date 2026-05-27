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
    const workout = await Workout.create({ ...req.body, user: req.user.id });
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
