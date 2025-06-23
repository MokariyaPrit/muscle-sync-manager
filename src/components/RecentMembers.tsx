
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const recentMembers = [
  { id: 1, name: 'Sarah Johnson', plan: 'Premium', joinDate: '2024-06-20', status: 'Active' },
  { id: 2, name: 'Mike Chen', plan: 'Basic', joinDate: '2024-06-19', status: 'Active' },
  { id: 3, name: 'Emily Davis', plan: 'Premium', joinDate: '2024-06-18', status: 'Pending' },
  { id: 4, name: 'James Wilson', plan: 'Standard', joinDate: '2024-06-17', status: 'Active' },
  { id: 5, name: 'Lisa Anderson', plan: 'Premium', joinDate: '2024-06-16', status: 'Active' },
];

export const RecentMembers = () => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Recent Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-orange-500 text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.plan} Plan</p>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={member.status === 'Active' ? 'default' : 'secondary'}
                  className={member.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {member.status}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">{member.joinDate}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
