const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

/**
 * POST /notifications/send-email
 * Send email notification
 */
router.post('/send-email', notificationController.sendEmail);

/**
 * POST /notifications/send-sms
 * Send SMS notification
 */
router.post('/send-sms', notificationController.sendSMS);

/**
 * GET /notifications/logs
 * Get all notification logs (Admin only)
 */
router.get('/logs', notificationController.getLogs);

module.exports = router;

