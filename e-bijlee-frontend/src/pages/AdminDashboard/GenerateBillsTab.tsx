import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';

const GenerateBillsTab: React.FC = () => {
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerateBills = async () => {
    if (!month) {
      setError('Please select a month');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosClient.post('/admin/generate-bills', { month });
      setSuccess(`Bills generated successfully for ${month}. ${response.data.generatedBills} bills created.`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate bills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Generate Bills</h3>
      {error && <ErrorAlert message={error} />}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <Button onClick={handleGenerateBills} disabled={loading}>
        {loading ? <Loader /> : 'Generate Bills'}
      </Button>
    </Card>
  );
};

export default GenerateBillsTab;
