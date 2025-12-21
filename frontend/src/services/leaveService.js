import apiClient from "./api";
import { API_ENDPOINTS } from "../config/api";


export const createLeave = async (payload) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.leave.apply, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getLeavesByEmployee = async (user) => {
  try {
    const employeeId = user?.id || user?.userId;

    if (!employeeId) {
      throw new Error("Employee ID not found");
    }

    const response = await apiClient.get(
      `${API_ENDPOINTS.leave.list}?employeeId=${employeeId}`
    );

    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getLeaveDetails = async (leaveId) => {
  try {
    if (!leaveId) {
      throw new Error("Leave ID is required");
    }

    const response = await apiClient.get(API_ENDPOINTS.leave.get(leaveId));

    if (!response.data?.success) {
      throw new Error("Failed to load leave details");
    }

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveLeave = async ({ leaveId, approvedBy }) => {
  try {
    if (!leaveId) {
      throw new Error("Leave ID is required");
    }

    const payload = {
      status: "APPROVED",
      approved_by: approvedBy,
    };

    const response = await apiClient.put(
      API_ENDPOINTS.leave.approve(leaveId),
      payload
    );

    if (!response.data?.success) {
      throw new Error("Failed to approve leave");
    }

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const rejectLeave = async ({ leaveId, rejectedBy }) => {
  try {
    if (!leaveId) {
      throw new Error("Leave ID is required");
    }

    const payload = {
      status: "REJECTED",
      approved_by: rejectedBy, 
    };

    const response = await apiClient.put(
      API_ENDPOINTS.leave.reject(leaveId),
      payload
    );

    if (!response.data?.success) {
      throw new Error("Failed to reject leave");
    }

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};