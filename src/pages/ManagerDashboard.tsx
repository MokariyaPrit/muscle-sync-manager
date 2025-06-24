
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { UserManagement } from '@/components/UserManagement';
import BookingRequests from '@/components/BookingRequests';
import { ClassScheduler } from '@/components/ClassScheduler';
import { StatsCard } from '@/components/ui/stats-card';
import { CollapsibleCard } from '@/components/ui/collapsible-card';
import { Users, Calendar, Activity, TrendingUp, MapPin, Clock } from 'lucide-react';

const ManagerDashboard = () => {
  const statsData = [
    {
      title: 'Region Members',
      value: '312',
      icon: <Users className="h-4 w-4" />,
      trend: { value: '+5%', isPositive: true },
      subtitle: 'from last month'
    },
    {
      title: 'Classes Today',
      value: '8',
      icon: <Calendar className="h-4 w-4" />,
      subtitle: '2 pending approval'
    },
    {
      title: 'Attendance Rate',
      value: '85%',
      icon: <Activity className="h-4 w-4" />,
      trend: { value: '+3%', isPositive: true },
      subtitle: 'this week'
    },
    {
      title: 'Region Revenue',
      value: '₹85,000',
      icon: <TrendingUp className="h-4 w-4" />,
      subtitle: 'This month'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 md:p-6 space-y-6 max-w-full overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                Manager Dashboard
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your region operations efficiently</p>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 bg-white/70 px-3 py-1 rounded-lg backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-blue-500" />
              Regional View
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
              icon={<Clock className="h-5 w-5 text-green-500" />}
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

export default ManagerDashboard;
