const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

const dietPlans = {
  'Balanced':           { protein: 25, carbs: 50, fats: 25 },
  'High Protein':       { protein: 40, carbs: 35, fats: 25 },
  'Low Carb':           { protein: 35, carbs: 25, fats: 40 },
  'Keto':               { protein: 25, carbs: 5,  fats: 70 },
  'Vegan':              { protein: 20, carbs: 55, fats: 25 },
  'Vegetarian':         { protein: 22, carbs: 52, fats: 26 },
  'Mediterranean':      { protein: 20, carbs: 50, fats: 30 },
  'Intermittent Fasting': { protein: 30, carbs: 40, fats: 30 }
};

router.get('/plans', auth, (req, res) => res.json(dietPlans));

router.put('/select', auth, async (req, res) => {
  try {
    const { dietType } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { dietType }, { new: true }).select('-password');
    res.json({ dietType: user.dietType, macros: dietPlans[user.dietType] });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
