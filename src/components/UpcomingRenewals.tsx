
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const renewals = [
  { id: 1, name: 'John Smith', plan: 'Premium', expiryDate: '2024-06-25', daysLeft: 2 },
  { id: 2, name: 'Anna Williams', plan: 'Standard', expiryDate: '2024-06-27', daysLeft: 4 },
  { id: 3, name: 'David Brown', plan: 'Basic', expiryDate: '2024-06-28', daysLeft: 5 },
  { id: 4, name: 'Sophie Taylor', plan: 'Premium', expiryDate: '2024-06-30', daysLeft: 7 },
];

export const UpcomingRenewals = () => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Upcoming Renewals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renewals.map((renewal) => (
            <div key={renewal.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    {renewal.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{renewal.name}</p>
                  <p className="text-sm text-gray-600">{renewal.plan} Plan</p>
                </div>
              </div>
              <div className="text-right flex items-center space-x-2">
                <div>
                  <Badge 
                    variant={renewal.daysLeft <= 3 ? 'destructive' : 'secondary'}
                    className={renewal.daysLeft <= 3 ? '' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {renewal.daysLeft} days
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{renewal.expiryDate}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Remind
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
