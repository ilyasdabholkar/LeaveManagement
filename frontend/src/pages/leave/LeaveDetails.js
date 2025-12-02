import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN' || user.role === 'admin';

  useEffect(() => {
    fetchLeaveDetails();
  }, [id]);

  const fetchLeaveDetails = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.leave.get(id));
      if (response.data.success) {
        setLeave(response.data.data);
      } else {
        setError('Failed to load leave details');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leave details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.leave.approve(id), {});
      if (response.data.success) {
        fetchLeaveDetails();
      }
    } catch (error) {
      alert('Failed to approve leave');
    }
  };

  const handleReject = async () => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.leave.reject(id), {});
      if (response.data.success) {
        fetchLeaveDetails();
      }
    } catch (error) {
      alert('Failed to reject leave');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading leave details...</p>
        </div>
      </div>
    );
  }

  if (error || !leave) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error || 'Leave not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm text-red-600 hover:text-red-800"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Request Details</h1>
          <p className="mt-2 text-sm text-gray-600">View detailed information about this leave request</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                {leave.status}
              </span>
            </div>
            {isAdmin && leave.status === 'PENDING' && (
              <div className="flex space-x-3">
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            )}
          </div>

          {/* Employee Information */}
          {leave.employeeName && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Employee</h3>
              <p className="text-base text-gray-900">{leave.employeeName}</p>
            </div>
          )}

          {/* Leave Type */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Leave Type</h3>
            <p className="text-base text-gray-900">{leave.leaveType}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
              <p className="text-base text-gray-900">
                {new Date(leave.startDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">End Date</h3>
              <p className="text-base text-gray-900">
                {new Date(leave.endDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
            <p className="text-base text-gray-900">{days} day(s)</p>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Reason</h3>
            <p className="text-base text-gray-900 whitespace-pre-wrap">{leave.reason}</p>
          </div>

          {/* Applied Date */}
          {leave.applied_at && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Applied On</h3>
              <p className="text-base text-gray-900">
                {new Date(leave.applied_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

          {/* Approval Details */}
          {leave.status !== 'PENDING' && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Approval Details</h3>
              {leave.approved_by && (
                <p className="text-sm text-gray-600">
                  Approved by: {leave.approved_by_name || 'Admin'}
                </p>
              )}
              {leave.approved_at && (
                <p className="text-sm text-gray-600">
                  Approved on: {new Date(leave.approved_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;

