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
 * Send OTP via SMS using Twilio
 * @param {string} phone - Recipient phone number (E.164 format: +919876543210)
 * @param {string} otp - OTP code to send
 * @returns {Promise<Object>} - SMS send result
 */
async function sendOTPSMS(phone, otp) {
    try {
        // Check if Twilio is configured
        if (!twilioClient) {
            console.warn('Twilio not configured. Using mock SMS service.');
            // Mock SMS for development/testing
            return {
                success: true,
                messageId: `mock-${Date.now()}`,
                message: `[MOCK] OTP ${otp} sent to ${phone}`,
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

        const message = await twilioClient.messages.create({
            body: `Your OTP for Leave Management System is: ${otp}. Valid for 5 minutes. Do not share this code.`,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to: phone
        });

        return {
            success: true,
            messageId: message.sid,
            message: 'OTP SMS sent successfully'
        };
    } catch (error) {
        console.error('Error sending OTP SMS:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    sendOTPSMS
};

