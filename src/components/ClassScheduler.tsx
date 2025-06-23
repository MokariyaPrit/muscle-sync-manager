
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { useToast } from '@/components/ui/use-toast';

interface ClassSchedule {
  id: string;
  name: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  enrolled?: number;
  region: string;
  createdBy: string;
}

export const ClassScheduler = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  const [newClass, setNewClass] = useState({
    name: '',
    instructor: '',
    date: '',
    time: '',
    duration: '',
    capacity: '',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchClasses = async () => {
    if (!user) return;

    try {
      let q;
      if (user.role === 'manager') {
        q = query(collection(db, 'classes'), where('region', '==', user.region));
      } else {
        q = collection(db, 'classes');
      }

      const querySnapshot = await getDocs(q);
      const classList: ClassSchedule[] = [];
      querySnapshot.forEach((doc) => {
        classList.push({ id: doc.id, ...doc.data() } as ClassSchedule);
      });
      setSchedules(classList);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch classes',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user]);

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.instructor || !newClass.date || !newClass.time || !user) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'classes'), {
        name: newClass.name,
        instructor: newClass.instructor,
        date: newClass.date,
        time: newClass.time,
        duration: newClass.duration || '60',
        capacity: parseInt(newClass.capacity) || 20,
        enrolled: 0,
        region: user.region,
        createdBy: user.email,
        createdAt: new Date().toISOString()
      });

      setNewClass({
        name: '',
        instructor: '',
        date: '',
        time: '',
        duration: '',
        capacity: '',
      });
      setIsDialogOpen(false);
      fetchClasses();
      
      toast({
        title: 'Success',
        description: 'Class added successfully',
      });
    } catch (error) {
      console.error('Error adding class:', error);
      toast({
        title: 'Error',
        description: 'Failed to add class',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'classes', id));
      fetchClasses();
      toast({
        title: 'Success',
        description: 'Class deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete class',
        variant: 'destructive'
      });
    }
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
                value={newClass.name}
                onChange={(e) => setNewClass({...newClass, name: e.target.value})}
              />
              <Input
                placeholder="Instructor"
                value={newClass.instructor}
                onChange={(e) => setNewClass({...newClass, instructor: e.target.value})}
              />
              <Input
                type="date"
                value={newClass.date}
                onChange={(e) => setNewClass({...newClass, date: e.target.value})}
              />
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
              <Button onClick={handleAddClass} disabled={loading} className="w-full">
                {loading ? 'Adding...' : 'Add Class'}
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
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>{schedule.instructor}</TableCell>
                <TableCell>{schedule.date}</TableCell>
                <TableCell>{schedule.time}</TableCell>
                <TableCell>{schedule.duration} min</TableCell>
                <TableCell>{schedule.capacity}</TableCell>
                <TableCell>{schedule.enrolled || 0}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
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
