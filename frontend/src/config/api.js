// API Gateway base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const AUTH_API_BASE_URL = process.env.REACT_APP_AUTH_URL 
const EMPLOYEE_API_BASE_URL = process.env.REACT_APP_EMPLOYEE_URL 


// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${AUTH_API_BASE_URL}/api/auth/authenticate`,
    register: `${AUTH_API_BASE_URL}/api/auth/register`,
  },
  // Employee endpoints
  employees: {
    list: `${EMPLOYEE_API_BASE_URL}/api/employees`,
    get: (id) => `${EMPLOYEE_API_BASE_URL}/api/employees/${id}`,
    create: `${EMPLOYEE_API_BASE_URL}/api/employees`,
    update: (id) => `${EMPLOYEE_API_BASE_URL}/api/employees/${id}`,
    delete: (id) => `${EMPLOYEE_API_BASE_URL}/api/employees/${id}`,
  },
  // Leave endpoints
  leave: {
    list: `${API_BASE_URL}/api/leave`,
    get: (id) => `${API_BASE_URL}/api/leave/${id}`,
    apply: `${API_BASE_URL}/api/leave/apply`,
    approve: (id) => `${API_BASE_URL}/api/leave/${id}/approve`,
    reject: (id) => `${API_BASE_URL}/api/leave/${id}/reject`,
    status: (id) => `${API_BASE_URL}/api/leave/${id}/status`,
  },
  // Notification endpoints
  notifications: {
    sendEmail: `${API_BASE_URL}/notifications/send-email`,
    sendSMS: `${API_BASE_URL}/notifications/send-sms`,
    getLogs: `${API_BASE_URL}/notifications/logs`,
  },
};

