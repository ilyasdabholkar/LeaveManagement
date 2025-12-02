const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const notificationLogSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        unique: true,
        index: true
    },
    type: {
        type: String,
        enum: ['EMAIL', 'SMS'],
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILED'],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    subject: {
        type: String,
        required: false
    },
    error: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    collection: 'notification_logs'
});

// Index for faster queries
notificationLogSchema.index({ created_at: -1 });
notificationLogSchema.index({ status: 1 });
notificationLogSchema.index({ type: 1 });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);

