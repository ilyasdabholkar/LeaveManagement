import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (to, name) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.notifications.welcome, {
      to,
      name,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Send OTP via SMS
 */
export const sendOTPSMS = async (phone, otp) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.notifications.otp, {
      phone,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Send leave approval email
 */
export const sendLeaveApprovalEmail = async (to, employeeName, leaveType, days, status) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.notifications.leaveApproved, {
      to,
      employeeName,
      leaveType,
      days,
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

