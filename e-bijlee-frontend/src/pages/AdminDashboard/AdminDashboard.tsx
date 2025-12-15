import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import UsersTab from './UsersTab';
import GenerateBillsTab from './GenerateBillsTab';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'generate'>('users');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Admin Panel – E-Bijilee" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'users'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === 'generate'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Generate Bills
            </button>
          </nav>
        </div>
        <div>
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'generate' && <GenerateBillsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
