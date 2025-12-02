import apiClient from "./api";
import { API_ENDPOINTS } from "../config/api";

export const createEmployee = async (payload) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.employees.create, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getEmployees = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.employees.list);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.employees.get(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateEmployee = async (id, payload) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.employees.update(id), payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.employees.delete(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
