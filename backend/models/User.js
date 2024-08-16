// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false } // Add this field for admin checks
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};


// Generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = mongoose.model('User', userSchema);
