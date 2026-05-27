const router = require('express').Router();
const auth = require('../middleware/auth');
const Water = require('../models/Water');

router.get('/:date', auth, async (req, res) => {
  try {
    let record = await Water.findOne({ user: req.user.id, date: req.params.date });
    res.json(record || { cups: 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { cups, date } = req.body;
    let record = await Water.findOne({ user: req.user.id, date });
    if (record) { record.cups = cups; await record.save(); }
    else { record = await Water.create({ user: req.user.id, cups, date }); }
    res.json(record);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
