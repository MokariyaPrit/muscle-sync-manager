
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AvailableClass {
  id: string;
  name: string;
  instructor: string;
  day: string;
  time: string;
  duration: string;
  capacity: number;
  enrolled: number;
  region: string;
}

export const ClassBooking = () => {
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState('North');
  
  const [availableClasses] = useState<AvailableClass[]>([
    {
      id: '1',
      name: 'Morning Yoga',
      instructor: 'Sarah Johnson',
      day: 'Monday',
      time: '07:00',
      duration: '60 min',
      capacity: 20,
      enrolled: 15,
      region: 'North'
    },
    {
      id: '2',
      name: 'HIIT Training',
      instructor: 'Mike Wilson',
      day: 'Tuesday',
      time: '18:00',
      duration: '45 min',
      capacity: 15,
      enrolled: 12,
      region: 'North'
    },
    {
      id: '3',
      name: 'Evening Pilates',
      instructor: 'Emma Davis',
      day: 'Wednesday',
      time: '19:00',
      duration: '50 min',
      capacity: 18,
      enrolled: 8,
      region: 'South'
    },
    {
      id: '4',
      name: 'Spinning Class',
      instructor: 'John Martinez',
      day: 'Thursday',
      time: '17:30',
      duration: '45 min',
      capacity: 25,
      enrolled: 20,
      region: 'North'
    }
  ]);

  const filteredClasses = availableClasses.filter(cls => cls.region === selectedRegion);

  const handleBookClass = (className: string) => {
    toast({
      title: "Booking Request Sent",
      description: `Your request to book ${className} has been sent for approval.`,
    });
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Book Classes
        </CardTitle>
        <div className="w-48">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="North">North Region</SelectItem>
              <SelectItem value="South">South Region</SelectItem>
              <SelectItem value="East">East Region</SelectItem>
              <SelectItem value="West">West Region</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium">{cls.name}</TableCell>
                <TableCell>{cls.instructor}</TableCell>
                <TableCell>{cls.day}</TableCell>
                <TableCell className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {cls.time}
                </TableCell>
                <TableCell>{cls.duration}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getAvailabilityBadge(cls.enrolled, cls.capacity)}
                    <span className="text-sm text-gray-500 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {cls.enrolled}/{cls.capacity}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm"
                    onClick={() => handleBookClass(cls.name)}
                    disabled={cls.enrolled >= cls.capacity}
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
