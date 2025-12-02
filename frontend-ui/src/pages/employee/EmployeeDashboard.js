import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch employee's leaves
      const response = await apiClient.get(`${API_ENDPOINTS.leave.list}?employeeId=${user.id || user.userId}`);
      const leaves = response.data?.data || [];

      const pending = leaves.filter(l => l.status === 'PENDING').length;
      const approved = leaves.filter(l => l.status === 'APPROVED').length;
      const rejected = leaves.filter(l => l.status === 'REJECTED').length;

      setStats({
        totalLeaves: leaves.length,
        pendingLeaves: pending,
        approvedLeaves: approved,
        rejectedLeaves: rejected,
      });

      // Get recent leaves (last 5)
      setRecentLeaves(leaves.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Mock data for development
      setStats({
        totalLeaves: 12,
        pendingLeaves: 3,
        approvedLeaves: 8,
        rejectedLeaves: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Leaves',
      value: stats.totalLeaves,
      color: 'bg-blue-500',
      icon: '📋',
    },
    {
      title: 'Pending',
      value: stats.pendingLeaves,
      color: 'bg-yellow-500',
      icon: '⏳',
    },
    {
      title: 'Approved',
      value: stats.approvedLeaves,
      color: 'bg-green-500',
      icon: '✅',
    },
    {
      title: 'Rejected',
      value: stats.rejectedLeaves,
      color: 'bg-red-500',
      icon: '❌',
    },
  ];

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Welcome back, {user.email || 'Employee'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leaves */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Leave Requests</h3>
            <Link
              to="/employee/my-leaves"
              className="text-sm text-primary-600 hover:text-primary-900 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="flow-root">
            {recentLeaves.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No leave requests found.</p>
                <Link
                  to="/employee/apply-leave"
                  className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Apply for Leave
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentLeaves.map((leave) => (
                  <li key={leave.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {leave.leaveType}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

