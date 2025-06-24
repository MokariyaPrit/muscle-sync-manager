import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ClassItem {
  id: string;
  name: string;
  instructor?: string;
  date: string;
  time: string;
  region: string;
  capacity?: number;
}

const BookClass = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [approvedCounts, setApprovedCounts] = useState<Record<string, number>>({});
  const [userBookings, setUserBookings] = useState<Set<string>>(new Set());
  const [userBookingStatus, setUserBookingStatus] = useState<Record<string, string>>({});
  const [userBookingDocIds, setUserBookingDocIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.region) return;

    const fetchClasses = async () => {
      const q = query(collection(db, 'classes'), where('region', '==', user.region));
      const snapshot = await getDocs(q);
      const classList: ClassItem[] = [];
      snapshot.forEach(doc => {
        classList.push({ id: doc.id, ...doc.data() } as ClassItem);
      });
      setClasses(classList);
    };

    fetchClasses();
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const q = query(collection(db, 'bookings'), where('userId', '==', user.id));
      const snapshot = await getDocs(q);

      const userBooked = new Set<string>();
      const userStatusMap: Record<string, string> = {};
      const userDocMap: Record<string, string> = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        userBooked.add(data.classId);
        userStatusMap[data.classId] = data.status;
        userDocMap[data.classId] = doc.id;
      });

      const allBookings = await getDocs(collection(db, 'bookings'));
      const classBookingMap: Record<string, number> = {};
      allBookings.forEach(doc => {
        const b = doc.data();
        if (b.status === 'approved') {
          const classId = b.classId;
          classBookingMap[classId] = (classBookingMap[classId] || 0) + 1;
        }
      });

      setApprovedCounts(classBookingMap);
      setUserBookings(userBooked);
      setUserBookingStatus(userStatusMap);
      setUserBookingDocIds(userDocMap);
    };

    fetchStats();
  }, [user]);

  const getAvailabilityBadge = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) {
      return <Badge variant="destructive">Almost Full</Badge>;
    } else if (percentage >= 70) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Limited</Badge>;
    } else {
      return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">N/A</Badge>;
    }
  };

  const handleBookClass = async (cls: ClassItem) => {
    if (!user) return;
    try {
      setLoading(true);

      await addDoc(collection(db, 'bookings'), {
        userId: user.id,
        memberName: user.name,
        classId: cls.id,
        className: cls.name,
        date: cls.date,
        time: cls.time,
        region: cls.region,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      toast({
        title: 'Booking Sent',
        description: `Your request for ${cls.name} has been sent.`,
      });

      setUserBookings(prev => new Set(prev).add(cls.id));
      setUserBookingStatus(prev => ({ ...prev, [cls.id]: 'pending' }));
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: 'Could not book class.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (classId: string) => {
    if (!user || !userBookingDocIds[classId]) return;
    try {
      await deleteDoc(doc(db, 'bookings', userBookingDocIds[classId]));
      toast({ title: 'Booking Cancelled', description: 'Your pending booking was cancelled.' });

      const updatedBookings = new Set(userBookings);
      updatedBookings.delete(classId);
      setUserBookings(updatedBookings);

      const { [classId]: _, ...rest } = userBookingStatus;
      setUserBookingStatus(rest);
    } catch (error) {
      console.error('Cancel error:', error);
      toast({ title: 'Error', description: 'Failed to cancel booking.', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Book Classes ({user?.region})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map(cls => {
              const approved = approvedCounts[cls.id] ?? 0;
              const capacity = cls.capacity ?? 20;
              const alreadyBooked = userBookings.has(cls.id);
              const status = userBookingStatus[cls.id];
              return (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.date}</TableCell>
                  <TableCell className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> {cls.time}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getAvailabilityBadge(approved, capacity)}
                      <span className="text-sm text-gray-500 flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {approved}/{capacity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {alreadyBooked ? (
                      <div className="flex flex-col space-y-1">
                        {renderStatusBadge(status)}
                        {status === 'pending' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelBooking(cls.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        disabled={loading || approved >= capacity}
                        onClick={() => handleBookClass(cls)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Book
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BookClass;    