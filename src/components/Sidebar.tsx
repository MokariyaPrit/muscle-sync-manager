
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Check,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
  Users
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Members', path: '/members' },
  { icon: User, label: 'Staff', path: '/staff' },
  { icon: Calendar, label: 'Attendance', path: '/attendance' },
  { icon: Check, label: 'Memberships', path: '/memberships' },
  { icon: ArrowUp, label: 'Payments', path: '/payments' },
  { icon: ArrowDown, label: 'Reports', path: '/reports' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Main Menu
          </h2>
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start space-x-3 h-12 transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg hover:from-blue-600 hover:to-orange-600" 
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
        
        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Upgrade Plan</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get access to premium features and unlimited regions.
            </p>
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
              Upgrade Now
            </Button>
          </div>
        </div>
      </nav>
    </aside>
  );
};
