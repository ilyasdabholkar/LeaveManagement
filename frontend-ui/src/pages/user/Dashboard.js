import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual data from API
    // For now, using mock data
    setStats({
      totalLeaves: 12,
      pendingLeaves: 3,
      approvedLeaves: 8,
      rejectedLeaves: 1,
    });
  }, []);

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

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Welcome to your leave management dashboard</p>
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
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Leave Requests</h3>
          <div className="flow-root">
            <div className="text-center py-8 text-gray-500">
              <p>No recent leave requests found.</p>
              <p className="text-sm mt-2">Apply for a leave to see it here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

