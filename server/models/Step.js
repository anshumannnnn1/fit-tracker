const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  count: Number,
  date: String
});

module.exports = mongoose.model('Step', StepSchema);