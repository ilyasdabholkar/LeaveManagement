import React, { useState, useEffect } from 'react';

const NotificationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch actual data from API
    // Mock data for demonstration
    setTimeout(() => {
      setLogs([
        {
          id: 1,
          type: 'Email',
          recipient: 'john@example.com',
          subject: 'Welcome to Leave Management System',
          status: 'Sent',
          timestamp: '2024-12-01T10:30:00Z',
        },
        {
          id: 2,
          type: 'SMS',
          recipient: '+919876543210',
          subject: 'OTP: 123456',
          status: 'Sent',
          timestamp: '2024-12-01T11:15:00Z',
        },
        {
          id: 3,
          type: 'Email',
          recipient: 'jane@example.com',
          subject: 'Leave Application Approved',
          status: 'Sent',
          timestamp: '2024-12-02T09:20:00Z',
        },
        {
          id: 4,
          type: 'Email',
          recipient: 'user@example.com',
          subject: 'Welcome Email',
          status: 'Failed',
          timestamp: '2024-12-02T14:45:00Z',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    return status === 'Sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTypeIcon = (type) => {
    return type === 'Email' ? '📧' : '📱';
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter((log) => log.type.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notification Logs</h1>
        <p className="mt-2 text-sm text-gray-600">View all notification activity</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('email')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'email'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setFilter('sms')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'sms'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            SMS
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No notification logs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xl">{getTypeIcon(log.type)}</span>
                        <span className="ml-2 text-sm text-gray-900">{log.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.recipient}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            log.status
                          )}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationLogs;

