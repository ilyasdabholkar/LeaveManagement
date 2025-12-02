const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Gmail address
        pass: process.env.SMTP_PASSWORD // Gmail App Password
    }
});

/**
 * Send welcome email to new user
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} - Email send result
 */
async function sendWelcomeEmail(to, name) {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER || 'noreply@leavemanagement.com',
            to: to,
            subject: 'Welcome to Leave Management System',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Leave Management System!</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${name},</p>
                            <p>We're excited to have you join our Leave Management System. Your account has been successfully created!</p>
                            <p>You can now:</p>
                            <ul>
                                <li>Login to your account</li>
                                <li>Apply for leaves</li>
                                <li>Track your leave status</li>
                                <li>View your leave history</li>
                            </ul>
                            <p>If you have any questions, please don't hesitate to contact our support team.</p>
                            <p>Best regards,<br>Leave Management Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId,
            message: 'Welcome email sent successfully'
        };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Send leave approval/rejection email
 * @param {string} to - Recipient email address
 * @param {string} employeeName - Employee name
 * @param {string} leaveType - Type of leave
 * @param {number} days - Number of days
 * @param {string} status - Approval status (approved/rejected)
 * @returns {Promise<Object>} - Email send result
 */
async function sendLeaveApprovalEmail(to, employeeName, leaveType, days, status) {
    try {
        const statusColor = status === 'approved' ? '#4CAF50' : '#f44336';
        const statusText = status === 'approved' ? 'Approved' : 'Rejected';

        const mailOptions = {
            from: process.env.SMTP_USER || 'noreply@leavemanagement.com',
            to: to,
            subject: `Leave Application ${statusText}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: ${statusColor}; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid ${statusColor}; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Leave Application ${statusText}</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${employeeName},</p>
                            <p>Your leave application has been <strong>${statusText}</strong>.</p>
                            <div class="details">
                                <p><strong>Leave Type:</strong> ${leaveType}</p>
                                <p><strong>Duration:</strong> ${days} day(s)</p>
                                <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText.toUpperCase()}</span></p>
                            </div>
                            <p>Please check your dashboard for more details.</p>
                            <p>Best regards,<br>Leave Management Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId,
            message: `Leave ${status} email sent successfully`
        };
    } catch (error) {
        console.error('Error sending leave approval email:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    sendWelcomeEmail,
    sendLeaveApprovalEmail
};

