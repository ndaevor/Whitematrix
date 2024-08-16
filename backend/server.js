const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
require('dotenv').config();
const { GridFSBucket } = require('mongodb');
// const adminRoutes = require('./routes/admin');

const app = express();
let gfs;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/grievances', grievanceRoutes);
// app.use('/api/admin', adminRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected');

     // Initialize GridFSBucket after MongoDB connection is established
     const db = mongoose.connection.db;
     gfs = new GridFSBucket(db, { bucketName: 'uploads' });
     app.locals.gfs = gfs; // Make gfs available throughout the app

    
})
.catch(err => console.error('Error connecting to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
