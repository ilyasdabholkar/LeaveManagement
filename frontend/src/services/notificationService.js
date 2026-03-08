import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

export const sendCredentialsNotification = async ({
  email,
  firstName,
  role,
  password,
}) => {
  try {
    const res = await apiClient.post(
      API_ENDPOINTS.notifications.sendCredentials,
      {
        email,
        firstName,
        role,
        password,
      }
    );

    return res.data;
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

