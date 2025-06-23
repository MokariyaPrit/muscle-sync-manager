
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
      <div className="text-center">
        <Shield className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-xl text-gray-300 mb-8">
          You don't have permission to access this page.
        </p>
        <Link to="/login">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
