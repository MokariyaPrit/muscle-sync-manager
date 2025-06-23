import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import React, { ReactNode } from 'react';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Checking authentication...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; //  render passed-in children
};

export default ProtectedRoute;
   