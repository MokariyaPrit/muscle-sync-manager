// ClassScheduler.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface ClassItem {
  id: string;
  name: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  region: string;
}

export const ClassScheduler = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [newClass, setNewClass] = useState<Omit<ClassItem, 'id'>>({
    name: '',
    instructor: '',
    date: '',
    time: '',
    duration: '60',
    capacity: 20,
    region: user?.role === 'admin' ? 'all' : user?.region || ''
  });
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


const fetchClasses = async () => {
  if (!user?.role) return;

  try {
    let q;

    if (user.role === 'admin') {
      // Admin sees all classes
      q = collection(db, 'classes');
    } else {
      // Manager sees classes in their region or region === 'all'
      q = query(
        collection(db, 'classes'),
        where('region', 'in', [user.region, 'all'])
      );
    }

    const querySnapshot = await getDocs(q);
    const classesList: ClassItem[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      classesList.push({
        id: doc.id,
        name: data.name,
        instructor: data.instructor,
        date: data.date?.toDate?.().toISOString().slice(0, 10) ?? '',
        time: data.time,
        duration: data.duration,
        capacity: data.capacity,
        region: data.region,
      }); 
    });

    setClasses(classesList);
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
    if (!user?.region) return;

    try {
      const classWithRegion = {
        ...newClass,
        region: user.role === 'admin' ? 'all' : user.region,
        date: Timestamp.fromDate(new Date(newClass.date))
      };

      const docRef = await addDoc(collection(db, 'classes'), classWithRegion);

      setClasses([...classes, { id: docRef.id, ...classWithRegion, date: newClass.date }]);
      setNewClass({
        name: '',
        instructor: '',
        date: '',
        time: '',
        duration: '60',
        capacity: 20,
        region: user.role === 'admin' ? 'all' : user.region
      });
      setIsDialogOpen(false);

      toast({ title: 'Success', description: 'Class scheduled successfully' });
    } catch (error) {
      console.error('Error adding class:', error);
      toast({ title: 'Error', description: 'Failed to schedule class', variant: 'destructive' });
    }
  };

  const handleEditClass = async () => {
    if (!editingClass) return;

    try {
      await updateDoc(doc(db, 'classes', editingClass.id), {
        name: editingClass.name,
        instructor: editingClass.instructor,
        date: Timestamp.fromDate(new Date(editingClass.date)),
        time: editingClass.time,
        duration: editingClass.duration,
        capacity: editingClass.capacity
      });

      setClasses(classes.map(cls => cls.id === editingClass.id ? editingClass : cls));
      setIsEditDialogOpen(false);
      setEditingClass(null);

      toast({ title: 'Success', description: 'Class updated successfully' });
    } catch (error) {
      console.error('Error updating class:', error);
      toast({ title: 'Error', description: 'Failed to update class', variant: 'destructive' });
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'classes', id));
      setClasses(classes.filter(cls => cls.id !== id));
      toast({ title: 'Success', description: 'Class deleted successfully' });
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({ title: 'Error', description: 'Failed to delete class', variant: 'destructive' });
    }
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Class Scheduler
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Class</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Class Name" value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} />
                <Input placeholder="Instructor" value={newClass.instructor} onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })} />
                <Input type="date" value={newClass.date} onChange={(e) => setNewClass({ ...newClass, date: e.target.value })} />
                <Input type="time" value={newClass.time} onChange={(e) => setNewClass({ ...newClass, time: e.target.value })} />
                <Input placeholder="Duration (minutes)" value={newClass.duration} onChange={(e) => setNewClass({ ...newClass, duration: e.target.value })} />
                <Input type="number" placeholder="Capacity" value={newClass.capacity} onChange={(e) => setNewClass({ ...newClass, capacity: parseInt(e.target.value) })} />
                <Button onClick={handleAddClass} className="w-full">Schedule Class</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium">{cls.name}</TableCell>
                <TableCell>{cls.instructor}</TableCell>
                <TableCell>{cls.date}</TableCell>
                <TableCell>{cls.time}</TableCell>
                <TableCell>{cls.capacity}</TableCell>
                <TableCell>{cls.region}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingClass(cls); setIsEditDialogOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClass(cls.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
            </DialogHeader>
            {editingClass && (
              <div className="space-y-4">
                <Input placeholder="Class Name" value={editingClass.name} onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })} />
                <Input placeholder="Instructor" value={editingClass.instructor} onChange={(e) => setEditingClass({ ...editingClass, instructor: e.target.value })} />
                <Input type="date" value={editingClass.date} onChange={(e) => setEditingClass({ ...editingClass, date: e.target.value })} />
                <Input type="time" value={editingClass.time} onChange={(e) => setEditingClass({ ...editingClass, time: e.target.value })} />
                <Input placeholder="Duration (minutes)" value={editingClass.duration} onChange={(e) => setEditingClass({ ...editingClass, duration: e.target.value })} />
                <Input type="number" placeholder="Capacity" value={editingClass.capacity} onChange={(e) => setEditingClass({ ...editingClass, capacity: parseInt(e.target.value) })} />
                <Button onClick={handleEditClass} className="w-full">Update Class</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
   