
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface ClassSchedule {
  id: string;
  className: string;
  instructor: string;
  day: string;
  time: string;
  duration: string;
  capacity: number;
  region: string;
}

export const ClassScheduler = () => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([
    {
      id: '1',
      className: 'Morning Yoga',
      instructor: 'Sarah Johnson',
      day: 'Monday',
      time: '07:00',
      duration: '60',
      capacity: 20,
      region: 'North'
    },
    {
      id: '2',
      className: 'HIIT Training',
      instructor: 'Mike Wilson',
      day: 'Tuesday',
      time: '18:00',
      duration: '45',
      capacity: 15,
      region: 'North'
    }
  ]);

  const [newClass, setNewClass] = useState({
    className: '',
    instructor: '',
    day: '',
    time: '',
    duration: '',
    capacity: '',
    region: 'North'
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddClass = () => {
    if (newClass.className && newClass.instructor && newClass.day && newClass.time) {
      const schedule: ClassSchedule = {
        id: Date.now().toString(),
        className: newClass.className,
        instructor: newClass.instructor,
        day: newClass.day,
        time: newClass.time,
        duration: newClass.duration,
        capacity: parseInt(newClass.capacity) || 20,
        region: newClass.region
      };
      setSchedules([...schedules, schedule]);
      setNewClass({
        className: '',
        instructor: '',
        day: '',
        time: '',
        duration: '',
        capacity: '',
        region: 'North'
      });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteClass = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weekly Class Schedule</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Class Name"
                value={newClass.className}
                onChange={(e) => setNewClass({...newClass, className: e.target.value})}
              />
              <Input
                placeholder="Instructor"
                value={newClass.instructor}
                onChange={(e) => setNewClass({...newClass, instructor: e.target.value})}
              />
              <Select value={newClass.day} onValueChange={(value) => setNewClass({...newClass, day: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="time"
                value={newClass.time}
                onChange={(e) => setNewClass({...newClass, time: e.target.value})}
              />
              <Input
                placeholder="Duration (minutes)"
                value={newClass.duration}
                onChange={(e) => setNewClass({...newClass, duration: e.target.value})}
              />
              <Input
                placeholder="Capacity"
                type="number"
                value={newClass.capacity}
                onChange={(e) => setNewClass({...newClass, capacity: e.target.value})}
              />
              <Button onClick={handleAddClass} className="w-full">
                Add Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.className}</TableCell>
                <TableCell>{schedule.instructor}</TableCell>
                <TableCell>{schedule.day}</TableCell>
                <TableCell>{schedule.time}</TableCell>
                <TableCell>{schedule.duration} min</TableCell>
                <TableCell>{schedule.capacity}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClass(schedule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
