
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ClassScheduler } from '@/components/ClassScheduler';
import BookingRequests from '@/components/BookingRequests';
import { Users, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import CountUp from 'react-countup';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const region = user?.region ?? '—';
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [growth, setGrowth] = useState<number | null>(null);
  const [growthDirection, setGrowthDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!user || !user.region) return;

    const fetchStats = async () => {
      try {
        const now = new Date();
        const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const thisMonthStart = firstDayOfCurrentMonth.toISOString();
        const lastMonthStart = firstDayOfLastMonth.toISOString();

        const currentQuery = query(
          collection(db, 'users'),
          where('region', '==', user.region),
          where('role', '==', 'customer'),
          where('createdAt', '>=', thisMonthStart)
        );

        const lastMonthQuery = query(
          collection(db, 'users'),
          where('region', '==', user.region),
          where('role', '==', 'customer'),
          where('createdAt', '>=', lastMonthStart),
          where('createdAt', '<', thisMonthStart)
        );

        const totalQuery = query(
          collection(db, 'users'),
          where('region', '==', user.region),
          where('role', '==', 'customer')
        );

        const [currentSnap, lastSnap, totalSnap] = await Promise.all([
          getDocs(currentQuery),
          getDocs(lastMonthQuery),
          getDocs(totalQuery),
        ]);

        const currentCount = currentSnap.size;
        const lastCount = lastSnap.size;
        setMemberCount(totalSnap.size);

        const growthRate = lastCount === 0 ? 100 : ((currentCount - lastCount) / lastCount) * 100;
        setGrowth(Math.round(growthRate));
        setGrowthDirection(growthRate >= 0 ? 'up' : 'down');
      } catch (err) {
        console.error('Error fetching growth:', err);
        setMemberCount(0);
        setGrowth(0);
        setGrowthDirection(null);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600">
                Regional management and oversight for <strong>{region}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Members Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Members in {region}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {memberCount !== null ? memberCount : '—'}
                  </div>
                  <p className="text-xs text-muted-foreground">Active customers</p>
                </CardContent>
              </Card>

              {/* Check-ins Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">Peak hours: 6–8 PM</p>
                </CardContent>
              </Card>

              {/* Revenue Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue in {region}</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,450</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              {/* Growth Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Growth in {region}</CardTitle>
                  {growthDirection === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : growthDirection === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${growthDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {growth !== null ? (
                      <CountUp end={Math.abs(growth)} duration={1.2} suffix="%" />
                    ) : (
                      'Loading...'
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Compared to last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClassScheduler />
              <BookingRequests />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
