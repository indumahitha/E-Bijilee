import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/Card';
import Loader from '../../components/Loader.tsx';
import ErrorAlert from '../../components/ErrorAlert';

interface Bill {
  _id: string;
  month: string;
  unitsUsed: number;
  amount: number;
  status: string;
  issuedDate: string;
  paidDate?: string;
}

const BillsSection: React.FC = () => {
  const [unpaidBills, setUnpaidBills] = useState<Bill[]>([]);
  const [paidBills, setPaidBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const [unpaidResponse, paidResponse] = await Promise.all([
          axiosClient.get('/user/bills?status=Unpaid'),
          axiosClient.get('/user/bills?status=Paid'),
        ]);
        setUnpaidBills(unpaidResponse.data);
        setPaidBills(paidResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load bills');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const renderBillTable = (bills: Bill[], title: string) => (
    <Card className="mb-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {bills.length === 0 ? (
        <p>No {title.toLowerCase()} found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-left">Units Used</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Issued Date</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id} className="border-t">
                  <td className="px-4 py-2">{bill.month}</td>
                  <td className="px-4 py-2">{bill.unitsUsed}</td>
                  <td className="px-4 py-2">${bill.amount}</td>
                  <td className="px-4 py-2">{bill.status}</td>
                  <td className="px-4 py-2">{new Date(bill.issuedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      {renderBillTable(unpaidBills, 'Unpaid Bills')}
      {renderBillTable(paidBills, 'Paid Bills')}
    </div>
  );
};

export default BillsSection;
