const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./src/config/database');

// Import routes
const notificationRoutes = require('./src/routes/notificationRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Notification Service is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Notification Service API',
        version: '1.0.0',
        endpoints: {
            sendEmail: 'POST /notifications/send-email',
            sendSMS: 'POST /notifications/send-sms',
            getLogs: 'GET /notifications/logs',
            health: 'GET /health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start server
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
    console.log(`🚀 Notification Service running on port ${PORT}`);
    console.log(`📧 Email: POST http://localhost:${PORT}/notifications/send-email`);
    console.log(`📱 SMS: POST http://localhost:${PORT}/notifications/send-sms`);
    console.log(`📜 Logs: GET http://localhost:${PORT}/notifications/logs`);
});
