const router = require('express').Router();
const auth = require('../middleware/auth');
const Step = require('../models/Step');

// Get today's steps
router.get('/:date', auth, async (req, res) => {
  try {
    const steps = await Step.find({ user: req.user.id, date: req.params.date });
    const total = steps.reduce((sum, s) => sum + s.count, 0);
    res.json({ total, logs: steps });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get weekly steps
router.get('/weekly/:startDate', auth, async (req, res) => {
  try {
    const start = new Date(req.params.startDate);
    const dates = Array.from({length:7}, (_,i) => {
      const d = new Date(start); d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });
    const result = await Promise.all(dates.map(async date => {
      const steps = await Step.find({ user: req.user.id, date });
      return { date, total: steps.reduce((s,x) => s + x.count, 0) };
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add steps
router.post('/', auth, async (req, res) => {
  try {
    const { count, date } = req.body;
    const step = await Step.create({ user: req.user.id, count, date });
    res.json(step);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
