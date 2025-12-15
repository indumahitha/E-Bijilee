import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/Button';
import Input from '../../components/Input.tsx';
import ErrorAlert from '../../components/ErrorAlert';
import Loader from '../../components/Loader.tsx';

interface User {
  _id: string;
  name: string;
  email: string;
  meterId: string;
  role: string;
  createdAt: string;
}

interface AddUsageModalProps {
  user: User;
  onClose: () => void;
}

const AddUsageModal: React.FC<AddUsageModalProps> = ({ user, onClose }) => {
  const [unitsUsed, setUnitsUsed] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosClient.post(`/admin/usage/${user._id}`, {
        unitsUsed: parseFloat(unitsUsed),
        month,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add usage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Add Usage for {user.name}</h3>
        {error && <ErrorAlert message={error} />}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="number"
              placeholder="Units Used"
              value={unitsUsed}
              onChange={(e) => setUnitsUsed(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Month (YYYY-MM)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Add Usage'}
            </Button>
            <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUsageModal;
