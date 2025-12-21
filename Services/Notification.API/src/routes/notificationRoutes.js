const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/send-email', notificationController.sendEmail);

router.post('/send-sms', notificationController.sendSMS);

router.post('/send-credentials', notificationController.sendCredentialsEmail);

router.get('/logs', notificationController.getLogs);

module.exports = router;

