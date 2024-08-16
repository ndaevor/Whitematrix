// route/grievanceRoutes.js
const express = require('express');
const multer = require('multer');
const Grievance = require('../models/Grievance');
const auth = require('../middleware/auth');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Email configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'devadathan468@gmail.com',
        pass: 'yeozqjgeqjlowtzi'
    }
});


// Submit Grievance
router.post('/submit', auth, upload.single('supportingDoc'), async (req, res) => {
    const { type, description } = req.body;

    try {
        let grievanceData = {
            type,
            description,
            user: req.user._id
        };

        if (req.file) {
            grievanceData.supportingDoc = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const grievance = new Grievance(grievanceData);
        await grievance.save();

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'dathan468@gmail.com', // Admin's email address
            subject: 'New Grievance Submitted',
            text: `A new grievance has been submitted.\n\nType: ${type}\nDescription: ${description}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // console.log('EMAIL_USER:', process.env.EMAIL_USER);
        // console.log('EMAIL_PASS:', process.env.EMAIL_PASS);


        res.status(201).json({ message: 'Grievance submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to submit grievance', error: err.message });
    }
});

// Serve the file stored in the database
router.get('/file/:id', async (req, res) => {
    try {
        const grievance = await Grievance.findById(req.params.id);

        if (!grievance || !grievance.supportingDoc) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.set('Content-Type', grievance.supportingDoc.contentType);
        res.send(grievance.supportingDoc.data);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching file', error: err.message });
    }
});

// Fetch grievances for the logged-in user
router.get('/my-grievances', auth, async (req, res) => {
    try {
        const grievances = await Grievance.find({ user: req.user._id });
        res.status(200).json(grievances);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin route to fetch all grievances
router.get('/admin/all', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

        const grievances = await Grievance.find().populate('user');
        res.status(200).json(grievances);
    } catch (err) {
        console.error('Error fetching grievances:', err);
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
