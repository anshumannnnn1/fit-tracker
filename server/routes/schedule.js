const router = require('express').Router();
const auth = require('../middleware/auth');
const Schedule = require('../models/Schedule');

router.get('/:date', auth, async (req, res) => {
  try {
    const entries = await Schedule.find({ user: req.user.id, date: req.params.date }).sort({ time: 1 });
    res.json(entries);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    // ✅ Fixed: destructure only expected fields instead of spreading raw req.body
    const { date, time, title, notes } = req.body;
    if (!date || !title) return res.status(400).json({ message: 'date and title are required' });

    const entry = await Schedule.create({ date, time, title, notes, user: req.user.id });
    res.json(entry);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Schedule.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;