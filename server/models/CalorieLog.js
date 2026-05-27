const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  meal:    { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], default: 'Snack' },
  calories: Number,
  protein:  Number,
  carbs:    Number,
  fats:     Number,
  time:    String
});

const CalorieLogSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:  { type: String, required: true },
  foods: [FoodItemSchema]
}, { timestamps: true });

CalorieLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('CalorieLog', CalorieLogSchema);
