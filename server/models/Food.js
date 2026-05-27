const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  meal: { type: String, enum: ['Breakfast','Lunch','Dinner','Snack'], default: 'Breakfast' },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  date: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Food', foodSchema);
