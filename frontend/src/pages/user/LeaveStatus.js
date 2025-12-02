import React, { useState, useEffect } from 'react';

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual data from API
    // Mock data for demonstration
    setTimeout(() => {
      setLeaves([
        {
          id: 1,
          leaveType: 'Casual',
          startDate: '2024-12-10',
          endDate: '2024-12-12',
          days: 3,
          reason: 'Personal work',
          status: 'Pending',
          appliedDate: '2024-12-05',
        },
        {
          id: 2,
          leaveType: 'Sick',
          startDate: '2024-11-25',
          endDate: '2024-11-25',
          days: 1,
          reason: 'Fever',
          status: 'Approved',
          appliedDate: '2024-11-20',
        },
        {
          id: 3,
          leaveType: 'Annual',
          startDate: '2024-11-15',
          endDate: '2024-11-20',
          days: 6,
          reason: 'Vacation',
          status: 'Rejected',
          appliedDate: '2024-11-10',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Leave Status</h1>
        <p className="mt-2 text-sm text-gray-600">Track all your leave applications</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {leaves.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No leave applications found.</p>
              <p className="text-sm mt-2">Apply for a leave to see it here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {leave.leaveType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(leave.startDate).toLocaleDateString()} -{' '}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {leave.days} day(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            leave.status
                          )}`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(leave.appliedDate).toLocaleDateString()}
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

export default LeaveStatus;

