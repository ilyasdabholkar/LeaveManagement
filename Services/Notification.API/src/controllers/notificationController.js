const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const notificationLogger = require('../services/notificationLogger');

/**
 * Send email notification
 */
async function sendEmail(req, res) {
    try {
        const { to, subject, body } = req.body;

        // Validation
        if (!to || !subject || !body) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: 'to', 'subject', and 'body' are required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Send email
        const result = await emailService.sendEmail(to, subject, body);

        // Log notification
        await notificationLogger.logNotification({
            type: 'EMAIL',
            recipient: to,
            message: body,
            status: result.success ? 'SUCCESS' : 'FAILED',
            subject: subject,
            error: result.success ? null : result.error
        });

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
                messageId: result.messageId
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send email",
                error: result.error
            });
        }
    } catch (error) {
        console.error("Error in sendEmail controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

/**
 * Send SMS notification
 */
async function sendSMS(req, res) {
    try {
        const { phone, message } = req.body;

        // Validation
        if (!phone || !message) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: 'phone' and 'message' are required"
            });
        }

        // Send SMS
        const result = await smsService.sendSMS(phone, message);

        // Log notification
        await notificationLogger.logNotification({
            type: 'SMS',
            recipient: phone,
            message: message,
            status: result.success ? 'SUCCESS' : 'FAILED',
            error: result.success ? null : result.error
        });

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
                messageId: result.messageId,
                ...(result.mock && { mock: true })
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send SMS",
                error: result.error
            });
        }
    } catch (error) {
        console.error("Error in sendSMS controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

/**
 * Get notification logs
 */
async function getLogs(req, res) {
    try {
        const { type, status, limit, offset } = req.query;
        
        const result = await notificationLogger.getNotificationLogs({
            type,
            status,
            limit: limit || 100,
            offset: offset || 0
        });

        return res.status(200).json({
            success: true,
            data: result.logs,
            total: result.total,
            limit: result.limit,
            offset: result.offset
        });
    } catch (error) {
        console.error("Error in getLogs controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports = {
    sendEmail,
    sendSMS,
    getLogs
};

