import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader.tsx';
import ErrorAlert from '../../components/ErrorAlert';
import AddUsageModal from './AddUsageModal';

interface User {
  _id: string;
  name: string;
  email: string;
  meterId: string;
  role: string;
  createdAt: string;
}

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get('/admin/users?page=1&limit=10');
        setUsers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Users</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Meter ID</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.meterId}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <Button onClick={() => setSelectedUser(user)}>Add Usage</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <AddUsageModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </Card>
  );
};

export default UsersTab;
