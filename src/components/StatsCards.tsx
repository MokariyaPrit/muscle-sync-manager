import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, User, Check } from 'lucide-react';

const stats = [
  {
    title: 'Total Members',
    value: '2,847',
    change: '+12%',
    trend: 'up',
    icon: User,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Daily Check-ins',
    value: '573',
    change: '+5%',
    trend: 'up',
    icon: Check,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Monthly Revenue',
    value: '$48,329',
    change: '+18%',
    trend: 'up',
    icon: ArrowUp,
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Expiring Soon',
    value: '127',
    change: '-3%',
    trend: 'down',
    icon: ArrowDown,
    color: 'from-red-500 to-red-600'
  }
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.trend === 'up';
        
        return (
          <Card key={stat.title} className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {isPositive ? (
                      <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
