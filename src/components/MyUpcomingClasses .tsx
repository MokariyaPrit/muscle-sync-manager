import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card';

interface Booking {
  id: string;
  className: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const MyUpcomingClasses = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!user) return;

      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', user.id)
      );

      const snapshot = await getDocs(q);
      const data: Booking[] = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as Booking);
      });

      // Optional: sort by date or time if needed
      setBookings(data);
    };

    fetchMyBookings();
  }, [user]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Upcoming Classes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-500">No bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{booking.className}</p>
                  <p className="text-sm text-gray-500">
                    {booking.date}, {booking.time}
                  </p>
                </div>
                <span className={`text-sm font-medium ${getStatusStyle(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
  