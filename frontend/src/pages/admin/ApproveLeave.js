import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLeavesWithEmployees } from '../../services/adminService';
import { approveLeave, rejectLeave } from '../../services/leaveService';
import { AuthService } from '../../services/authService';

const PAGE_SIZE = 10;

const ApproveLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('PENDING');
  const [employeeId, setEmployeeId] = useState('');

  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const user = AuthService.getLoggedInUser();
 const fetchLeaves = async () => {
  setLoading(true);
  try {
    const { data, total } = await fetchLeavesWithEmployees({
      status,
      employeeId,
      limit: PAGE_SIZE,
      offset,
    });

    setLeaves(data);
    setTotal(total);
  } catch (error) {
    console.error("Error fetching leaves:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchLeaves();
  }, [status, employeeId, offset]);

  const updateLeaveStatus = async (leaveId, action) => {
    try {
      if(action == 'approve'){
        console.log("Leave Id : ",leaveId);
        await approveLeave({leaveId:leaveId,approvedBy:user.userId});
      }else{
        await rejectLeave({leaveId:leaveId,rejectedBy:user.userId})
      }

      fetchLeaves(); // refresh after action
    } catch (error) {
      console.error(`Error trying to ${action} leave:`, error);
      alert(`Failed to ${action} leave`);
    }
  };

  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Approve / Reject Leaves
          </h1>
          <p className="text-sm text-gray-600">
            Review and manage leave applications
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              setOffset(0);
              setStatus(e.target.value);
            }}
            className="mt-1 block w-full border-gray-300 rounded-md"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee ID
          </label>
          <input
            value={employeeId}
            onChange={(e) => {
              setOffset(0);
              setEmployeeId(e.target.value);
            }}
            placeholder="employee email or id"
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : leaves.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No leave applications found.
        </div>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <div
              key={leave.id}
              className="bg-white border rounded-lg p-5 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{leave.employeeName}</p>
                  <p className="text-sm text-gray-500">
                    {leave.leave_type} | {leave.start_date} → {leave.end_date}
                  </p>
                </div>

                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  {leave.status}
                </span>
              </div>

              {leave.reason && (
                <p className="mt-3 text-sm text-gray-700">{leave.reason}</p>
              )}

              {leave.status === 'PENDING' && (
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => updateLeaveStatus(leave.id, 'reject')}
                    className="px-4 py-2 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateLeaveStatus(leave.id, 'approve')}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {offset + 1} –{' '}
          {Math.min(offset + PAGE_SIZE, total)} of {total}
        </p>

        <div className="space-x-2">
          <button
            disabled={!canPrev}
            onClick={() => setOffset(offset - PAGE_SIZE)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={!canNext}
            onClick={() => setOffset(offset + PAGE_SIZE)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveLeave;
