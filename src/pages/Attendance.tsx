
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

const Attendance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
                <p className="text-gray-600 mt-1">Track member attendance and check-ins.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Attendance Tracking</h2>
              <p className="text-gray-600">Attendance tracking features will be implemented here.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Attendance;
