const mongoose = require('mongoose');
const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  intensity: { type: String, enum: ['light','moderate','hard'], default: 'moderate' },
  caloriesBurned: { type: Number, default: 0 },
  date: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Workout', workoutSchema);
