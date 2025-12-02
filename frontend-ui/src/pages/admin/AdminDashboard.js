import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch employees count
      const employeesRes = await apiClient.get(API_ENDPOINTS.employees.list);
      const totalEmployees = employeesRes.data?.data?.length || 0;

      // Fetch pending leaves
      const pendingRes = await apiClient.get(`${API_ENDPOINTS.leave.list}?status=PENDING`);
      const pendingLeaves = pendingRes.data?.data?.length || 0;

      // Fetch approved leaves
      const approvedRes = await apiClient.get(`${API_ENDPOINTS.leave.list}?status=APPROVED`);
      const approvedLeaves = approvedRes.data?.data?.length || 0;

      // Fetch rejected leaves
      const rejectedRes = await apiClient.get(`${API_ENDPOINTS.leave.list}?status=REJECTED`);
      const rejectedLeaves = rejectedRes.data?.data?.length || 0;

      // Fetch recent pending leave requests
      const recentRes = await apiClient.get(`${API_ENDPOINTS.leave.list}?status=PENDING&limit=5`);
      setRecentLeaves(recentRes.data?.data || []);

      setStats({
        totalEmployees,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data on error for development
      setStats({
        totalEmployees: 25,
        pendingLeaves: 5,
        approvedLeaves: 45,
        rejectedLeaves: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      color: 'bg-blue-500',
      icon: '👥',
      link: '/admin/employees',
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      color: 'bg-yellow-500',
      icon: '⏳',
      link: '/admin/approve-leave',
    },
    {
      title: 'Approved Leaves',
      value: stats.approvedLeaves,
      color: 'bg-green-500',
      icon: '✅',
    },
    {
      title: 'Rejected Leaves',
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Overview of your leave management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link || '#'}
            className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow ${!stat.link ? 'cursor-default' : ''}`}
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
          </Link>
        ))}
      </div>

      {/* Recent Leave Requests */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Leave Requests</h3>
            <Link
              to="/admin/approve-leave"
              className="text-sm text-primary-600 hover:text-primary-900 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="flow-root">
            {recentLeaves.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No pending leave requests.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentLeaves.map((leave) => (
                  <li key={leave.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {leave.employeeName || 'Employee'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {leave.leaveType} • {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          PENDING
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

export default AdminDashboard;

