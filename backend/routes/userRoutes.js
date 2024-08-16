// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    try {
        const user = await User.findOne({ email });
        console.log('User found:', user);

        if (!user || !(await user.comparePassword(password))) {
            console.log('Invalid credentials');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = user.generateAuthToken();
        console.log('Token generated:', token);
        res.json({ token, isAdmin: user.isAdmin });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: err.message });
    }
});



// Get User Info (Protected)
router.get('/me', auth, (req, res) => {
    res.json(req.user);
});

module.exports = router;
