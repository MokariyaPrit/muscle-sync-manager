
import React from 'react';
import { StatsCards } from '@/components/StatsCards';
import { AttendanceChart } from '@/components/AttendanceChart';
import { RecentMembers } from '@/components/RecentMembers';
import { RegionOverview } from '@/components/RegionOverview';
import { UpcomingRenewals } from '@/components/UpcomingRenewals';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening at your gym.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <RegionOverview />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMembers />
        <UpcomingRenewals />
      </div>
    </div>
  );
};
