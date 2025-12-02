const NotificationLog = require('../models/NotificationLog');

/**
 * Log notification to MongoDB
 * @param {Object} logData - Notification log data
 * @returns {Promise<Object>} - Logged notification
 */
async function logNotification(logData) {
    try {
        const { type, recipient, message, status, subject, error } = logData;
        
        const log = new NotificationLog({
            type: type.toUpperCase(), // EMAIL or SMS
            recipient,
            message,
            status: status.toUpperCase(), // SUCCESS or FAILED
            subject: subject || null,
            error: error || null
        });

        await log.save();
        return log;
    } catch (error) {
        console.error('Error logging notification:', error);
        throw error;
    }
}

/**
 * Get all notification logs
 * @param {Object} filters - Optional filters (type, status, limit, offset)
 * @returns {Promise<Array>} - List of notification logs
 */
async function getNotificationLogs(filters = {}) {
    try {
        const { type, status, limit = 100, offset = 0 } = filters;
        
        const query = {};
        if (type) query.type = type.toUpperCase();
        if (status) query.status = status.toUpperCase();

        const logs = await NotificationLog.find(query)
            .sort({ created_at: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(offset))
            .lean();

        const total = await NotificationLog.countDocuments(query);

        return {
            logs,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    } catch (error) {
        console.error('Error fetching notification logs:', error);
        throw error;
    }
}

module.exports = {
    logNotification,
    getNotificationLogs
};

