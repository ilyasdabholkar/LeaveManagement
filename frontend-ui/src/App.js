import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth Pages
import Login from './pages/user/Login';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ApplyLeave from './pages/user/ApplyLeave';
import MyLeaves from './pages/employee/MyLeaves';
import LeaveDetails from './pages/leave/LeaveDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ApproveLeave from './pages/admin/ApproveLeave';
import UserList from './pages/admin/UserList';
import AddEditEmployee from './pages/admin/AddEditEmployee';
import NotificationLogs from './pages/admin/NotificationLogs';

// Developer Pages
import NotificationTesting from './pages/developer/NotificationTesting';

// Layout Component
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <EmployeeDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/apply-leave"
          element={
            <PrivateRoute>
              <Layout>
                <ApplyLeave />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/my-leaves"
          element={
            <PrivateRoute>
              <Layout>
                <MyLeaves />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <PrivateRoute>
              <Layout>
                <UserList />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees/add"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditEmployee />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employees/edit/:id"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditEmployee />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/approve-leave"
          element={
            <PrivateRoute>
              <Layout>
                <ApproveLeave />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/notification-logs"
          element={
            <PrivateRoute>
              <Layout>
                <NotificationLogs />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Shared Routes */}
        <Route
          path="/leaves/:id"
          element={
            <PrivateRoute>
              <Layout>
                <LeaveDetails />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Developer Routes */}
        <Route
          path="/developer/notifications"
          element={
            <Layout>
              <NotificationTesting />
            </Layout>
          }
        />

        {/* Legacy Routes - Redirects */}
        <Route path="/dashboard" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="/apply-leave" element={<Navigate to="/employee/apply-leave" replace />} />
        <Route path="/leave-status" element={<Navigate to="/employee/my-leaves" replace />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
