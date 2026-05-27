const mongoose = require('mongoose');
const waterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cups: { type: Number, default: 0 },
  date: { type: String, required: true, unique: false }
}, { timestamps: true });
module.exports = mongoose.model('Water', waterSchema);
