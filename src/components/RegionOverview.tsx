
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const regions = [
  { name: 'North Region', members: 850, capacity: 1000, revenue: '$18,240' },
  { name: 'South Region', members: 720, capacity: 900, revenue: '$15,680' },
  { name: 'East Region', members: 650, capacity: 800, revenue: '$14,200' },
  { name: 'West Region', members: 627, capacity: 750, revenue: '$13,890' },
];

export const RegionOverview = () => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Region Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {regions.map((region, index) => {
            const utilization = (region.members / region.capacity) * 100;
            
            return (
              <div key={region.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">{region.name}</h4>
                  <span className="text-sm text-gray-600">{region.revenue}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{region.members} / {region.capacity} members</span>
                  <span>{utilization.toFixed(0)}% capacity</span>
                </div>
                <Progress 
                  value={utilization} 
                  className="h-2"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
