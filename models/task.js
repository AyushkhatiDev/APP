const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  passwordHash: { 
    type: String, 
    required: true,
    select: false
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 100
  }
}, { 
  timestamps: true 
});

userSchema.index({ email: 1 });

userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('passwordHash')) return next();
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.passwordHash);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;