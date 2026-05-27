const mongoose = require('mongoose');
const scheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: String },
  title: { type: String, required: true },
  detail: { type: String },
  type: { type: String, enum: ['workout','meal','rest','other'], default: 'other' },
  date: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Schedule', scheduleSchema);
