
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Booking {
  id: string;
  memberName: string;
  className: string;
  date: string;
  time: string;
  region: string;
  status: 'pending' | 'approved' | 'rejected';
}

const BookingRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      let q;
      if (user.role === 'manager') {
        q = query(
          collection(db, 'bookings'),
          where('region', '==', user.region)
        );
      } else {
        q = collection(db, 'bookings');
      }

      const snapshot = await getDocs(q);
      const list: Booking[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as {
          memberName?: string;
          className?: string;
          date?: string;
          time?: string;
          region?: string;
          status?: 'pending' | 'approved' | 'rejected';
        };
        list.push({ 
          id: docSnap.id, 
          memberName: data.memberName || '',
          className: data.className || '',
          date: data.date || '',
          time: data.time || '',
          region: data.region || '',
          status: data.status || 'pending'
        } as Booking);
      });

      setBookings(list);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch booking requests',
        variant: 'destructive'
      });
    }
  };

  const handleUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      setBookings(prev =>
        prev.map(req => req.id === id ? { ...req, status } : req)
      );
      toast({
        title: 'Success',
        description: `Booking ${status} successfully`,
      });
    } catch (err) {
      console.error(`Failed to ${status}:`, err);
      toast({
        title: 'Error',
        description: `Failed to ${status} booking`,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Class Booking Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] overflow-auto">
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
            {bookings.map(booking => (
              <TableRow key={booking.id}>
                <TableCell>{booking.memberName}</TableCell>
                <TableCell>{booking.className}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>{booking.region}</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  {booking.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdate(booking.id, 'approved')}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdate(booking.id, 'rejected')}
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

export default BookingRequests;
