// models/Grievance.js
const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    description: { type: String, required: true },
    supportingDoc: { 
        data: Buffer,
        contentType: String 
    },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Add an index to the user field for better performance on user-based queries
grievanceSchema.index({ user: 1 });

module.exports = mongoose.model('Grievance', grievanceSchema);
