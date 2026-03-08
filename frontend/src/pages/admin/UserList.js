import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../../services/employeeService";
import { AuthService } from "../../services/authService";
import { sendCredentialsNotification } from "../../services/notificationService";
import { FiEdit2, FiTrash2, FiKey } from "react-icons/fi";


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [credentialUser, setCredentialUser] = useState(null);
  const [password, setPassword] = useState("");
  const [assigning, setAssigning] = useState(false);

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      console.log(response.data);
      setUsers(response.data);
    } catch (ex) {
      console.error("FetchEmployees : ", ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getStatusColor = (status) => {
    return status?.toUpperCase() === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
    setDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      setDeleting(true);
      await deleteEmployee(selectedUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      handleCancelDelete();
    } catch (ex) {
      console.error("DeleteEmployee : ", ex);
      setDeleting(false);
    }
  };

  const handleAssignCredentials = (user) => {
    setCredentialUser(user);
    setPassword("");
    setShowCredentialModal(true);
  };

  const handleCloseCredentialModal = () => {
    setShowCredentialModal(false);
    setCredentialUser(null);
    setPassword("");
    setAssigning(false);
  };

  const handleSubmitCredentials = async () => {
    if (!password) return;

    try {
      setAssigning(true);

      await AuthService.assignCredentials({
        id: credentialUser.id,
        email: credentialUser.email,
        role: "EMPLOYEE",
        password,
      });

      await sendCredentialsNotification({
        email: credentialUser.email,
        firstName: credentialUser.firstName,
        role: "EMPLOYEE",
        password,
      });

      handleCloseCredentialModal();
      alert("Credentials assigned successfully");
    } catch (error) {
      console.error("AssignCredentials:", error);
      alert(error?.message || "Failed to assign credentials");
      setAssigning(false);
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User List</h1>
          <p className="mt-2 text-sm text-gray-600">Manage all system users</p>
        </div>

        <button
          onClick={() => navigate("/admin/employees/add")}
          className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Add New
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {`${user.firstName} ${user.lastName}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-4">
                          {/* Edit */}
                          <button
                            title="Edit User"
                            onClick={() =>
                              navigate(`/admin/employees/edit/${user.id}`)
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit2 size={18} />
                          </button>

                          {/* Assign Credentials */}
                          <button
                            title="Assign Credentials"
                            onClick={() => handleAssignCredentials(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiKey size={18} />
                          </button>

                          {/* Delete */}
                          <button
                            title="Delete User"
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCredentialModal && credentialUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Assign Credentials
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Assign login credentials for{" "}
              <span className="font-medium">
                {credentialUser.firstName} {credentialUser.lastName}
              </span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md"
                placeholder="Enter password"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseCredentialModal}
                className="px-4 py-2 text-sm rounded-md border border-gray-300"
                disabled={assigning}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCredentials}
                disabled={assigning}
                className="px-4 py-2 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {assigning ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Employee
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {selectedUser.firstName} {selectedUser.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
