const router = require("express").Router();
const emailService = require("../services/emailService");
const smsService = require("../services/smsService");

/**
 * POST /api/notifications/welcome
 * Send welcome email to new user
 * Called from User Service
 */
router.post("/welcome", async (req, res) => {
    try {
        const { to, name } = req.body;

        // Validation
        if (!to || !name) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: 'to' and 'name' are required"
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

        // Send welcome email
        const result = await emailService.sendWelcomeEmail(to, name);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
                messageId: result.messageId
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send welcome email",
                error: result.error
            });
        }
    } catch (error) {
        console.error("Error in welcome notification endpoint:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

/**
 * POST /api/notifications/otp
 * Send OTP via SMS
 * Called from Auth Service
 */
router.post("/otp", async (req, res) => {
    try {
        const { phone, otp } = req.body;

        // Validation
        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: 'phone' and 'otp' are required"
            });
        }

        // Validate OTP format (should be 4-6 digits)
        if (!/^\d{4,6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "OTP must be 4-6 digits"
            });
        }

        // Send OTP SMS
        const result = await smsService.sendOTPSMS(phone, otp);

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
                message: "Failed to send OTP SMS",
                error: result.error
            });
        }
    } catch (error) {
        console.error("Error in OTP notification endpoint:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

/**
 * POST /api/notifications/leave-approved
 * Send leave approval/rejection email
 * Called from Leave Service
 */
router.post("/leave-approved", async (req, res) => {
    try {
        const { to, employeeName, leaveType, days, status } = req.body;

        // Validation
        if (!to || !employeeName || !leaveType || !days || !status) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: 'to', 'employeeName', 'leaveType', 'days', and 'status' are required"
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

        // Validate status
        if (!['approved', 'rejected'].includes(status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "Status must be 'approved' or 'rejected'"
            });
        }

        // Validate days
        if (isNaN(days) || days <= 0) {
            return res.status(400).json({
                success: false,
                message: "Days must be a positive number"
            });
        }

        // Send leave approval email
        const result = await emailService.sendLeaveApprovalEmail(
            to,
            employeeName,
            leaveType,
            parseInt(days),
            status.toLowerCase()
        );

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: result.message,
                messageId: result.messageId
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send leave approval email",
                error: result.error
            });
        }
    } catch (error) {
        console.error("Error in leave-approved notification endpoint:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

module.exports = router;
