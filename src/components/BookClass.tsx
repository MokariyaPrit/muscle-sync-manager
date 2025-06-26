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
  doc,
  getDoc
} from 'firebase/firestore';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, MapPinCheckInsideIcon, Users } from 'lucide-react';
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
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkMembership = async () => {
      if (!user?.id) return;
      const snap = await getDoc(doc(db, "memberships", user.id));
      if (snap.exists()) {
        const data = snap.data();
        if (data.status === "active" && new Date(data.expiry.toDate?.() || data.expiry) > new Date()) {
          setIsPremium(true);
        }
      }
    };
    checkMembership();
  }, [user]);

  useEffect(() => {
  if (!user?.region) return;

  const fetchClasses = async () => {
    const regionQuery = query(collection(db, "classes"), where("region", "==", user.region));
    const allQuery = query(collection(db, "classes"), where("region", "==", "all"));

    const [regionSnap, allSnap] = await Promise.all([
      getDocs(regionQuery),
      getDocs(allQuery),
    ]);

    const classList: ClassItem[] = [];

    regionSnap.forEach((doc) => {
      const data = doc.data();
      classList.push({
        id: doc.id,
        name: data.name,
        instructor: data.instructor,
        date: data.date?.toDate?.().toLocaleDateString() ?? "",
        time: data.time,
        region: data.region,
        capacity: data.capacity,
      });
    });

    allSnap.forEach((doc) => {
      const data = doc.data() as any;
      classList.push({
        id: doc.id,
        name: data.name,
        instructor: data.instructor,
        date: data.date?.toDate?.().toLocaleDateString() ?? "",
        time: data.time,
        region: data.region,
        capacity: data.capacity,
      });
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

      const status = isPremium ? 'approved' : 'pending';

      await addDoc(collection(db, 'bookings'), {
        userId: user.id,
        memberName: user.name,
        classId: cls.id,
        className: cls.name,
        date: cls.date,
        time: cls.time,
        region: cls.region,
        status,
        createdAt: new Date().toISOString()
      });

      toast({
        title: isPremium ? 'Booking Confirmed' : 'Booking Sent',
        description: `Your booking for ${cls.name} has been ${status}.`,
      });

      setUserBookings(prev => new Set(prev).add(cls.id));
      setUserBookingStatus(prev => ({ ...prev, [cls.id]: status }));
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
    <Card className="shadow-lg border rounded-xl">
  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl px-6 py-4">
    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
      <Calendar className="w-5 h-5" />
      Book Classes ({user?.region})
    </CardTitle>
  </CardHeader>

  <CardContent className="px-4 py-6">
    <Table className="table-auto w-full text-sm">
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead>Class</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Region</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {classes.map((cls) => {
          const approved = approvedCounts[cls.id] ?? 0;
          const capacity = cls.capacity ?? 20;
          const alreadyBooked = userBookings.has(cls.id);
          const status = userBookingStatus[cls.id];

          return (
            <TableRow key={cls.id} className="hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">{cls.name}</TableCell>
              <TableCell>{cls.date}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {cls.time}
                </div>
              </TableCell>
             
              <TableCell>
                <div className="flex items-center gap-2">
                  {getAvailabilityBadge(approved, capacity)}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {approved}/{capacity}
                  </span>
                </div>
              </TableCell>
               <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {cls.region}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {alreadyBooked ? (
                  <div className="flex flex-col items-center gap-1">
                    {renderStatusBadge(status)}
                    {status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-100"
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
                    className="bg-primary hover:bg-primary/90 text-white"
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
   