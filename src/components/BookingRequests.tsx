
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface BookingRequest {
  id: string;
  memberName: string;
  className: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  region: string;
}

export const BookingRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BookingRequest[]>([
    {
      id: '1',
      memberName: 'John Doe',
      className: 'Morning Yoga',
      date: '2024-06-25',
      time: '07:00',
      status: 'pending',
      region: 'North'
    },
    {
      id: '2',
      memberName: 'Jane Smith',
      className: 'HIIT Training',
      date: '2024-06-26',
      time: '18:00',
      status: 'pending',
      region: 'North'
    },
    {
      id: '3',
      memberName: 'Bob Johnson',
      className: 'Evening Pilates',
      date: '2024-06-27',
      time: '19:00',
      status: 'approved',
      region: 'South'
    }
  ]);

  // Filter requests based on user role
  const filteredRequests = user?.role === 'manager' 
    ? requests.filter(req => req.region === 'North') // Assuming manager handles North region
    : requests;

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Booking Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.memberName}</TableCell>
                <TableCell>{request.className}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>{request.time}</TableCell>
                <TableCell>{request.region}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(request.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
