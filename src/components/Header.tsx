import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

const handleConfirmLogout = async () => {
  await logout();
  setShowConfirm(false);
  toast.success('You have been logged out');

  switch (user?.role) {
    case 'admin':
      navigate('/');
      break;
    case 'manager':
      navigate('/');
      break;
    case 'customer': 
      navigate('/');
      break;
    default:
      navigate('/login');
  }
};

  if (!user) return null;

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + App Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                FitZone Pro
              </h1>
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-300" />
            <div className="hidden md:block">
              <span className="text-sm text-gray-500">Gym Management System</span>
            </div>
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
              <div className="text-xs text-gray-500 capitalize">
                {user.role} • {user.region}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(true)}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
     