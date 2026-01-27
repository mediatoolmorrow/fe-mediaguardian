import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Loader2, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { api } from '../../services/api';

export default function UserListpage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [makingAdmin, setMakingAdmin] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, roleFilter, searchQuery]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('backend_token');
      const response = await api.getUserList(token);
      if (response.success) {
        setUsers(response.data || []);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (err) {
      setError(err.message || 'Failed to load user list');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];

    // Filter by role
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.username && user.username.toLowerCase().includes(query))
      );
    }

    setFilteredUsers(result);
  };

  const handleMakeAdmin = async (email) => {
    if (!window.confirm(`Are you sure you want to make ${email} an admin?`)) {
      return;
    }

    setMakingAdmin(email);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('backend_token');
      const response = await api.addAdmin(token, email);
      if (response.success) {
        setSuccessMessage(response.message || 'User is now an admin');
        loadUsers();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to make user admin');
      }
    } catch (err) {
      setError(err.message || 'Failed to make user admin');
    } finally {
      setMakingAdmin(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Admin
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            User
          </span>
        );
    }
  };

  const getProviderBadge = (provider) => {
    const colors = {
      google: 'bg-red-100 text-red-800',
      line: 'bg-green-100 text-green-800',
      email: 'bg-blue-100 text-blue-800',
      firebase: 'bg-orange-100 text-orange-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[provider] || 'bg-gray-100 text-gray-800'}`}>
        {provider || 'Unknown'}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive !== false ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        Inactive
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Users className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">User List</h2>
        <span className="text-gray-500">({filteredUsers.length} users)</span>
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or username..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
            <option value="superadmin">Super Admins</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={loadUsers}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Username</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Provider</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Created At</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id || user.email} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{user.email || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{user.username || '-'}</td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">{getProviderBadge(user.provider)}</td>
                    <td className="py-3 px-4">{getStatusBadge(user.isActive)}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.role === 'user' && (
                        <button
                          onClick={() => handleMakeAdmin(user.email)}
                          disabled={makingAdmin === user.email}
                          className="text-blue-600 hover:text-blue-800 transition-colors disabled:text-gray-400 flex items-center space-x-1 ml-auto"
                          title="Make admin"
                        >
                          {makingAdmin === user.email ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <>
                              <UserPlus size={16} />
                              <span className="text-sm">Make Admin</span>
                            </>
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
