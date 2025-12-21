const emailService = require("../services/emailService");
const smsService = require("../services/smsService");
const notificationLogger = require("../services/notificationLogger");

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
        message:
          "Missing required fields: 'to', 'subject', and 'body' are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Send email
    const result = await emailService.sendEmail(to, subject, body);

    // Log notification
    await notificationLogger.logNotification({
      type: "EMAIL",
      recipient: to,
      message: body,
      status: result.success ? "SUCCESS" : "FAILED",
      subject: subject,
      error: result.success ? null : result.error,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        messageId: result.messageId,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in sendEmail controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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
        message: "Missing required fields: 'phone' and 'message' are required",
      });
    }

    // Send SMS
    const result = await smsService.sendSMS(phone, message);

    // Log notification
    await notificationLogger.logNotification({
      type: "SMS",
      recipient: phone,
      message: message,
      status: result.success ? "SUCCESS" : "FAILED",
      error: result.success ? null : result.error,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        messageId: result.messageId,
        ...(result.mock && { mock: true }),
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send SMS",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in sendSMS controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

/**
 * Send generated credentials to employee via email
 */
async function sendCredentialsEmail(req, res) {
  try {
    const { email, firstName, role, password } = req.body;

    // Validation
    if (!email || !firstName || !role || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: 'email', 'firstName', 'role', 'password'",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Email content
    const subject = "Your Login Credentials";

   const body = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background-color: #ffffff;
    }
    .header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 15px;
      text-align: center;
      border-radius: 6px 6px 0 0;
    }
    .content {
      padding: 20px;
    }
    .credentials {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
    }
    .credentials p {
      margin: 6px 0;
      font-family: monospace;
    }
    .footer {
      font-size: 12px;
      color: #6b7280;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h2>Your Login Credentials</h2>
    </div>

    <div class="content">
      <p>Hi <strong>${firstName}</strong>,</p>

      <p>Your account has been created successfully. Below are your login credentials:</p>

      <div class="credentials">
        <p><strong>Password:</strong> ${password}</p>
      </div>

      <p>
        If you did not request this account, please contact the administrator.
      </p>

      <p>Regards,<br />HR / Admin Team</p>
    </div>

    <div class="footer">
      This is an automated email. Please do not reply.
    </div>
  </div>
</body>
</html>
`;


    // Send email
    const result = await emailService.sendEmail(email, subject, body);

    // Log notification
    await notificationLogger.logNotification({
      type: "EMAIL",
      recipient: email,
      subject,
      message: body,
      status: result.success ? "SUCCESS" : "FAILED",
      error: result.success ? null : result.error,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Credentials email sent successfully",
        messageId: result.messageId,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to send credentials email",
      error: result.error,
    });
  } catch (error) {
    console.error("Error in sendCredentialsEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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
      offset: offset || 0,
    });

    return res.status(200).json({
      success: true,
      data: result.logs,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    });
  } catch (error) {
    console.error("Error in getLogs controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  sendEmail,
  sendSMS,
  getLogs,
  sendCredentialsEmail
};
