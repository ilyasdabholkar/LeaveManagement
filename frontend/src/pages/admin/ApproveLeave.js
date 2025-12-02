import React, { useState, useEffect } from 'react';

const ApproveLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual data from API
    // Mock data for demonstration
    setTimeout(() => {
      setLeaves([
        {
          id: 1,
          employeeName: 'John Doe',
          employeeEmail: 'john@example.com',
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
          employeeName: 'Jane Smith',
          employeeEmail: 'jane@example.com',
          leaveType: 'Sick',
          startDate: '2024-12-15',
          endDate: '2024-12-16',
          days: 2,
          reason: 'Medical appointment',
          status: 'Pending',
          appliedDate: '2024-12-08',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = async (leave) => {
    try {
      // TODO: Call actual API
      // await apiClient.post(API_ENDPOINTS.leave.approve(leave.id));
      
      setLeaves(leaves.map((l) => (l.id === leave.id ? { ...l, status: 'Approved' } : l)));
      alert('Leave approved successfully!');
    } catch (error) {
      alert('Failed to approve leave. Please try again.');
    }
  };

  const handleReject = async (leave) => {
    try {
      // TODO: Call actual API
      // await apiClient.post(API_ENDPOINTS.leave.reject(leave.id));
      
      setLeaves(leaves.map((l) => (l.id === leave.id ? { ...l, status: 'Rejected' } : l)));
      alert('Leave rejected successfully!');
    } catch (error) {
      alert('Failed to reject leave. Please try again.');
    }
  };

  const pendingLeaves = leaves.filter((leave) => leave.status === 'Pending');

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
        <h1 className="text-3xl font-bold text-gray-900">Approve/Reject Leave</h1>
        <p className="mt-2 text-sm text-gray-600">Review and manage leave applications</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {pendingLeaves.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No pending leave applications.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{leave.employeeName}</h3>
                      <p className="text-sm text-gray-500">{leave.employeeEmail}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {leave.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Leave Type</p>
                      <p className="text-sm font-medium text-gray-900">{leave.leaveType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(leave.startDate).toLocaleDateString()} -{' '}
                        {new Date(leave.endDate).toLocaleDateString()} ({leave.days} days)
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Reason</p>
                      <p className="text-sm font-medium text-gray-900">{leave.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Applied Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(leave.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleReject(leave)}
                      className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(leave)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveLeave;

