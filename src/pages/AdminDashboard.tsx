
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { UserManagement } from '@/components/UserManagement';
import BookingRequests from '@/components/BookingRequests';
import { ClassScheduler } from '@/components/ClassScheduler';
import { StatsCard } from '@/components/ui/stats-card';
import { CollapsibleCard } from '@/components/ui/collapsible-card';
import { Users, Calendar, Settings, BarChart3, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const statsData = [
    {
      title: 'Total Members',
      value: '1,245',
      icon: <Users className="h-4 w-4" />,
      trend: { value: '+12%', isPositive: true },
      subtitle: 'from last month'
    },
    {
      title: 'Active Classes',
      value: '45',
      icon: <Calendar className="h-4 w-4" />,
      subtitle: 'Across all regions'
    },
    {
      title: 'Staff Members',
      value: '28',
      icon: <Settings className="h-4 w-4" />,
      trend: { value: '+2', isPositive: true },
      subtitle: 'this month'
    },
    {
      title: 'Monthly Revenue',
      value: '₹2,45,000',
      icon: <BarChart3 className="h-4 w-4" />,
      trend: { value: '+8%', isPositive: true },
      subtitle: 'from last month'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 md:p-6 space-y-6 max-w-full overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your gym operations with ease</p>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 bg-white/70 px-3 py-1 rounded-lg backdrop-blur-sm">
              <Activity className="h-4 w-4 text-green-500" />
              Live Dashboard
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statsData.map((stat, index) => (
              <div
                key={stat.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <StatsCard {...stat} />
              </div>
            ))}
          </div>

          {/* Management Sections */}
          <div className="space-y-6">
            <CollapsibleCard
              title="User Management"
              icon={<Users className="h-5 w-5 text-blue-500" />}
              className="animate-fade-in"
              style={{ animationDelay: '400ms' }}
            >
              <UserManagement />
            </CollapsibleCard>
            
            <CollapsibleCard
              title="Booking Requests"
              icon={<Calendar className="h-5 w-5 text-orange-500" />}
              className="animate-fade-in"
              style={{ animationDelay: '500ms' }}
            >
              <BookingRequests />
            </CollapsibleCard>
            
            <CollapsibleCard
              title="Class Scheduler"
              icon={<Settings className="h-5 w-5 text-green-500" />}
              className="animate-fade-in"
              style={{ animationDelay: '600ms' }}
            >
              <ClassScheduler />
            </CollapsibleCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
