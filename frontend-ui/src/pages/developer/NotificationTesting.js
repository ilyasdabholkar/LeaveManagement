import React, { useState } from 'react';
import {
  sendWelcomeEmail,
  sendOTPSMS,
  sendLeaveApprovalEmail,
} from '../../services/notificationService';

const NotificationTesting = () => {
  const [welcomeForm, setWelcomeForm] = useState({ to: '', name: '' });
  const [otpForm, setOtpForm] = useState({ phone: '', otp: '' });
  const [leaveForm, setLeaveForm] = useState({
    to: '',
    employeeName: '',
    leaveType: 'Casual',
    days: 1,
    status: 'approved',
  });

  const [results, setResults] = useState({
    welcome: null,
    otp: null,
    leave: null,
  });

  const [loading, setLoading] = useState({
    welcome: false,
    otp: false,
    leave: false,
  });

  const handleWelcomeSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, welcome: true });
    setResults({ ...results, welcome: null });

    try {
      const result = await sendWelcomeEmail(welcomeForm.to, welcomeForm.name);
      setResults({ ...results, welcome: result });
      if (result.success) {
        setWelcomeForm({ to: '', name: '' });
      }
    } catch (error) {
      setResults({
        ...results,
        welcome: {
          success: false,
          message: error.message || 'Failed to send welcome email',
        },
      });
    } finally {
      setLoading({ ...loading, welcome: false });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, otp: true });
    setResults({ ...results, otp: null });

    try {
      const result = await sendOTPSMS(otpForm.phone, otpForm.otp);
      setResults({ ...results, otp: result });
      if (result.success) {
        setOtpForm({ phone: '', otp: '' });
      }
    } catch (error) {
      setResults({
        ...results,
        otp: {
          success: false,
          message: error.message || 'Failed to send OTP SMS',
        },
      });
    } finally {
      setLoading({ ...loading, otp: false });
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, leave: true });
    setResults({ ...results, leave: null });

    try {
      const result = await sendLeaveApprovalEmail(
        leaveForm.to,
        leaveForm.employeeName,
        leaveForm.leaveType,
        leaveForm.days,
        leaveForm.status
      );
      setResults({ ...results, leave: result });
      if (result.success) {
        setLeaveForm({
          to: '',
          employeeName: '',
          leaveType: 'Casual',
          days: 1,
          status: 'approved',
        });
      }
    } catch (error) {
      setResults({
        ...results,
        leave: {
          success: false,
          message: error.message || 'Failed to send leave approval email',
        },
      });
    } finally {
      setLoading({ ...loading, leave: false });
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notification Testing</h1>
        <p className="mt-2 text-sm text-gray-600">Test notification service endpoints</p>
      </div>

      <div className="space-y-8">
        {/* Welcome Email */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Welcome Email</h2>
            <form onSubmit={handleWelcomeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="welcome-email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="welcome-email"
                    value={welcomeForm.to}
                    onChange={(e) => setWelcomeForm({ ...welcomeForm, to: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="welcome-name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="welcome-name"
                    value={welcomeForm.name}
                    onChange={(e) => setWelcomeForm({ ...welcomeForm, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading.welcome}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading.welcome ? 'Sending...' : 'Send Welcome Email'}
              </button>
              {results.welcome && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    results.welcome.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  <p className="text-sm">{results.welcome.message}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* OTP SMS */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send OTP SMS</h2>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="otp-phone" className="block text-sm font-medium text-gray-700">
                    Phone Number (E.164 format)
                  </label>
                  <input
                    type="tel"
                    id="otp-phone"
                    value={otpForm.phone}
                    onChange={(e) => setOtpForm({ ...otpForm, phone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="+919876543210"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="otp-code" className="block text-sm font-medium text-gray-700">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    id="otp-code"
                    value={otpForm.otp}
                    onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="123456"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading.otp}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading.otp ? 'Sending...' : 'Send OTP SMS'}
              </button>
              {results.otp && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    results.otp.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  <p className="text-sm">{results.otp.message}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Leave Approval Email */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Leave Approval Email</h2>
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="leave-email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="leave-email"
                    value={leaveForm.to}
                    onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="employee@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="leave-name" className="block text-sm font-medium text-gray-700">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    id="leave-name"
                    value={leaveForm.employeeName}
                    onChange={(e) => setLeaveForm({ ...leaveForm, employeeName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="leave-type" className="block text-sm font-medium text-gray-700">
                    Leave Type
                  </label>
                  <select
                    id="leave-type"
                    value={leaveForm.leaveType}
                    onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  >
                    <option value="Casual">Casual</option>
                    <option value="Sick">Sick</option>
                    <option value="Annual">Annual</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Paternity">Paternity</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="leave-days" className="block text-sm font-medium text-gray-700">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    id="leave-days"
                    min="1"
                    value={leaveForm.days}
                    onChange={(e) => setLeaveForm({ ...leaveForm, days: parseInt(e.target.value) || 1 })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="leave-status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="leave-status"
                    value={leaveForm.status}
                    onChange={(e) => setLeaveForm({ ...leaveForm, status: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  >
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading.leave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading.leave ? 'Sending...' : 'Send Leave Approval Email'}
              </button>
              {results.leave && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    results.leave.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  <p className="text-sm">{results.leave.message}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTesting;

