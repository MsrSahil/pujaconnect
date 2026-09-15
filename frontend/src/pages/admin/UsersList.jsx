import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';
import { User, Phone, Mail, Calendar, Shield } from 'lucide-react';

export const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <Shield size={12} className="mr-1" /> ADMIN
          </span>
        );
      case 'pandit':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
            PANDIT
          </span>
        );
      case 'user':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            DEVOTEE
          </span>
        );
    }
  };

  if (loading) return <Loader message="Loading platform users..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Platform Users Directory</h2>
          <p className="text-sm text-gray-500">
            Total {users.length} registered accounts across all roles.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-orange-500 w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-orange-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">Devotee (User)</option>
            <option value="pandit">Pandit</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm mr-3">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-0.5">
                          <Mail size={12} className="mr-1" /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getRoleBadge(u.role)}</td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-700 flex items-center">
                      <Phone size={13} className="mr-1.5 text-gray-400" /> {u.phone || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={13} className="mr-1.5 text-gray-400" />
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
