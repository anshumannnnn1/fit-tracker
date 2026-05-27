const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    age: Number, weight: Number, height: Number, gender: { type: String, enum: ['male','female'], default: 'male' }
  },
  stepGoal: { type: Number, default: 10000 },
  calGoal: { type: Number, default: 2000 },
  waterGoal: { type: Number, default: 8 },
  dietType: { type: String, default: 'Balanced' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(pass) {
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model('User', userSchema);
