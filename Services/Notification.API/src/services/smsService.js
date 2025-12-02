const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
}

/**
 * Send SMS notification
 * @param {string} phone - Recipient phone number (E.164 format: +919876543210)
 * @param {string} message - SMS message content
 * @returns {Promise<Object>} - SMS send result
 */
async function sendSMS(phone, message) {
    try {
        // Check if Twilio is configured
        if (!twilioClient) {
            console.warn('Twilio not configured. Using mock SMS service.');
            return {
                success: true,
                messageId: `mock-${Date.now()}`,
                message: `[MOCK] SMS sent to ${phone}: ${message}`,
                mock: true
            };
        }

        // Validate phone number format (should be E.164 format)
        if (!phone.startsWith('+')) {
            return {
                success: false,
                error: 'Phone number must be in E.164 format (e.g., +919876543210)'
            };
        }

        const smsResult = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        return {
            success: true,
            messageId: smsResult.sid,
            message: 'SMS sent successfully'
        };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    sendSMS
};

