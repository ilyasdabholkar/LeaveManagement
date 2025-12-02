const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Microservice URLs (can be overridden via environment variables)
const SERVICES = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5265',
    employee: process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:5219',
    leave: process.env.LEAVE_SERVICE_URL || 'http://localhost:5555',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5004'
};

// Proxy middleware function
const createProxy = (targetBaseUrl) => {
    return async (req, res) => {
        try {
            const targetUrl = `${targetBaseUrl}${req.originalUrl}`;
            
            console.log(`[Gateway] ${req.method} ${req.originalUrl} -> ${targetUrl}`);

            const config = {
                method: req.method,
                url: targetUrl,
                headers: {
                    ...req.headers,
                    host: undefined, // Remove host header
                },
                data: req.body,
                validateStatus: () => true, // Accept all status codes
            };

            const response = await axios(config);
            
            // Forward the response
            res.status(response.status).json(response.data);
        } catch (error) {
            console.error(`[Gateway Error] ${req.originalUrl}:`, error.message);
            res.status(500).json({
                success: false,
                message: 'Gateway error: Service unavailable',
                error: error.message
            });
        }
    };
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Gateway is running',
        services: SERVICES
    });
});

// Auth Service routes
app.use('/api/auth', createProxy(SERVICES.auth));

// Employee Service routes
app.use('/api/employees', createProxy(SERVICES.employee));

// Leave Service routes
app.use('/api/leave', createProxy(SERVICES.leave));
app.use('/api/leaves', createProxy(SERVICES.leave));

// Notification Service routes
app.use('/api/notifications', createProxy(SERVICES.notification));
app.use('/notifications', createProxy(SERVICES.notification));

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'Leave Management System - API Gateway',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth/*',
            employees: '/api/employees/*',
            leave: '/api/leave/*',
            notifications: '/api/notifications/*'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`📡 Routing to services:`);
    console.log(`   - Auth Service: ${SERVICES.auth}`);
    console.log(`   - Employee Service: ${SERVICES.employee}`);
    console.log(`   - Leave Service: ${SERVICES.leave}`);
    console.log(`   - Notification Service: ${SERVICES.notification}`);
});

