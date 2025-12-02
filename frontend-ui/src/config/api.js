// API Gateway base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/api/auth/authenticate`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  // Employee endpoints
  employees: {
    list: `${API_BASE_URL}/api/employees`,
    get: (id) => `${API_BASE_URL}/api/employees/${id}`,
    create: `${API_BASE_URL}/api/employees`,
    update: (id) => `${API_BASE_URL}/api/employees/${id}`,
    delete: (id) => `${API_BASE_URL}/api/employees/${id}`,
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

