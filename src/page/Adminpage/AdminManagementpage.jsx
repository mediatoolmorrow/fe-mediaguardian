import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminManagementpage({ currentUserEmail }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [removingEmail, setRemovingEmail] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('backend_token');
      const response = await api.getAdminList(token);
      if (response.success) {
        setAdmins(response.data || []);
      } else {
        setError(response.message || 'Failed to load admins');
      }
    } catch (err) {
      setError(err.message || 'Failed to load admin list');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setAddingAdmin(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('backend_token');
      const response = await api.addAdmin(token, newAdminEmail.trim());
      if (response.success) {
        setSuccessMessage(response.message || 'Admin added successfully');
        setNewAdminEmail('');
        loadAdmins();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to add admin');
      }
    } catch (err) {
      setError(err.message || 'Failed to add admin');
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (email) => {
    if (email === currentUserEmail) {
      setError('You cannot remove your own admin role');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove admin role from ${email}?`)) {
      return;
    }

    setRemovingEmail(email);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('backend_token');
      const response = await api.removeAdmin(token, email);
      if (response.success) {
        setSuccessMessage(response.message || 'Admin removed successfully');
        loadAdmins();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to remove admin');
      }
    } catch (err) {
      setError(err.message || 'Failed to remove admin');
    } finally {
      setRemovingEmail(null);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'superadmin') {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
          Super Admin
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        Admin
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Admin Management</h2>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center space-x-2 p-4 bg-green-100 text-green-800 rounded-lg">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-100 text-red-800 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Add New Admin Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <UserPlus size={20} className="text-blue-600" />
          <span>Add New Admin</span>
        </h3>
        <form onSubmit={handleAddAdmin} className="flex space-x-4">
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Enter user email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
          <button
            type="submit"
            disabled={addingAdmin}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {addingAdmin ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Add Admin</span>
              </>
            )}
          </button>
        </form>
        <p className="mt-2 text-sm text-gray-500">
          Enter the email of an existing user to grant them admin privileges.
        </p>
      </div>

      {/* Current Admins Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Admins</h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No admins found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Username</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Created At</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id || admin.email} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="text-gray-800">{admin.email}</span>
                      {admin.email === currentUserEmail && (
                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{admin.username || '-'}</td>
                    <td className="py-3 px-4">{getRoleBadge(admin.role)}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {admin.role !== 'superadmin' && admin.email !== currentUserEmail && (
                        <button
                          onClick={() => handleRemoveAdmin(admin.email)}
                          disabled={removingEmail === admin.email}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400"
                          title="Remove admin role"
                        >
                          {removingEmail === admin.email ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
