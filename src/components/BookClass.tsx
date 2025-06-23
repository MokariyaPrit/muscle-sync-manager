import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  duration?: string;
  capacity?: number;
  enrolled?: number;
  region: string;
}

const BookClass = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.region) return;

    const fetchClasses = async () => {
      const q = query(collection(db, 'classes'), where('region', '==', user.region));
      const querySnapshot = await getDocs(q);

      const results: ClassItem[] = [];
      querySnapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() } as ClassItem);
      });

      setClasses(results);
    };

    fetchClasses();
  }, [user]);

  const getAvailabilityBadge = (enrolled: number = 0, capacity: number = 20) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) {
      return <Badge variant="destructive">Almost Full</Badge>;
    } else if (percentage >= 70) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Limited</Badge>;
    } else {
      return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
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
            {classes.map(cls => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium">{cls.name}</TableCell>
                <TableCell>{cls.date}</TableCell>
                <TableCell className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> {cls.time}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getAvailabilityBadge(cls.enrolled, cls.capacity)}
                    <span className="text-sm text-gray-500 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {cls.enrolled ?? 0}/{cls.capacity ?? 20}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    disabled={loading || (cls.enrolled ?? 0) >= (cls.capacity ?? 20)}
                    onClick={() => handleBookClass(cls)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Book
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BookClass;
  