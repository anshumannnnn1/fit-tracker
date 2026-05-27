const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

const VALID_DIET_TYPES = [
  'Balanced', 'High Protein', 'Low Carb', 'Keto',
  'Vegan', 'Vegetarian', 'Mediterranean', 'Intermittent Fasting'
];

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/', auth, async (req, res) => {
  try {
    const { name, profile, stepGoal, calGoal, waterGoal, dietType } = req.body;

    // ✅ Fixed: validate numeric goals
    if (stepGoal !== undefined && (isNaN(stepGoal) || Number(stepGoal) < 0))
      return res.status(400).json({ message: 'Invalid stepGoal' });
    if (calGoal !== undefined && (isNaN(calGoal) || Number(calGoal) < 0))
      return res.status(400).json({ message: 'Invalid calGoal' });
    if (waterGoal !== undefined && (isNaN(waterGoal) || Number(waterGoal) < 0))
      return res.status(400).json({ message: 'Invalid waterGoal' });

    // ✅ Fixed: validate dietType if provided
    if (dietType !== undefined && !VALID_DIET_TYPES.includes(dietType))
      return res.status(400).json({ message: 'Invalid dietType' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, profile, stepGoal, calGoal, waterGoal, dietType },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;