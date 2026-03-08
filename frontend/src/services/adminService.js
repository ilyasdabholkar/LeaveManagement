import apiClient from "./api";
import { API_ENDPOINTS } from "../config/api";

export const fetchDashboardStats = async () => {
  try {
    const [
      employeesRes,
      pendingRes,
      approvedRes,
      rejectedRes,
      recentLeavesRes,
    ] = await Promise.all([
      apiClient.get(API_ENDPOINTS.employees.list),
      apiClient.get(`${API_ENDPOINTS.leave.list}?status=PENDING`),
      apiClient.get(`${API_ENDPOINTS.leave.list}?status=APPROVED`),
      apiClient.get(`${API_ENDPOINTS.leave.list}?status=REJECTED`),
      apiClient.get(`${API_ENDPOINTS.leave.list}?status=PENDING&limit=5`),
    ]);

    const employees = employeesRes.data?.data || [];
    const recentLeaves = recentLeavesRes.data?.data || [];

    const employeeMap = {};
    employees.forEach((emp) => {
      employeeMap[emp.email] = emp;
      employeeMap[emp.id] = emp;
    });

    const enrichedRecentLeaves = recentLeaves.map((leave) => {
      const emp = employeeMap[leave.employee_id];

      return {
        ...leave,
        employeeName: emp
          ? `${emp.firstName} ${emp.lastName}`
          : "Unknown Employee",
      };
    });
    return {
      stats: {
        totalEmployees: employees.length,
        pendingLeaves: pendingRes.data?.data?.length || 0,
        approvedLeaves: approvedRes.data?.data?.length || 0,
        rejectedLeaves: rejectedRes.data?.data?.length || 0,
      },
      recentLeaves: enrichedRecentLeaves,
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchLeavesWithEmployees = async ({
  status,
  employeeId,
  limit,
  offset,
}) => {
  try {
    const params = new URLSearchParams({
      status,
      employee_id: employeeId,
      limit,
      offset,
    }).toString();

    const leavesRes = await apiClient.get(
      `${API_ENDPOINTS.leave.list}?${params}`
    );

    const leaves = leavesRes.data?.data || [];
    const total = leavesRes.data?.total || 0;

    const employeesRes = await apiClient.get(API_ENDPOINTS.employees.list);
    const employees = employeesRes.data?.data || [];

    const employeeMap = {};
    employees.forEach((emp) => {
      employeeMap[emp.email] = emp;
      employeeMap[emp.id] = emp;
    });

    const enrichedLeaves = leaves.map((leave) => {
      const emp = employeeMap[leave.employee_id];

      return {
        ...leave,
        employeeName: emp
          ? `${emp.firstName} ${emp.lastName}`
          : leave.employee_id, 
      };
    });

    return {
      data: enrichedLeaves,
      total,
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }

  
};