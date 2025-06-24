import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users } from 'lucide-react';
import { db } from '@/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
  region: string;
  createdAt?: string;
}

export const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('UserManagement - Current user:', currentUser);
  console.log('UserManagement - Users list:', users);

  const fetchUsers = async () => {
    if (!currentUser) {
      console.log('No current user, skipping fetch');
      return;
    }

    console.log('Fetching users for role:', currentUser.role, 'region:', currentUser.region);

    try {
      let q;
      if (currentUser.role === 'admin') {
        q = collection(db, 'users');
      } else {
        q = query(collection(db, 'users'), where('region', '==', currentUser.region));
      }

      const querySnapshot = await getDocs(q);
      const usersList: User[] = [];
      querySnapshot.forEach((docSnap) => {
        const userData = docSnap.data() as {
          name?: string;
          email?: string;
          role?: 'admin' | 'manager' | 'customer';
          region?: string;
          createdAt?: string;
        };
        usersList.push({ 
          id: docSnap.id, 
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'customer',
          region: userData.region || '',
          createdAt: userData.createdAt || ''
        } as User);
      });
      
      // console.log('Fetched users:', usersList);
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    console.log('UserManagement useEffect triggered, currentUser:', currentUser);
    fetchUsers();
  }, [currentUser]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', editingUser.id), {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        region: editingUser.region,
        updatedAt: new Date().toISOString()
      });

      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setIsEditDialogOpen(false);
      setEditingUser(null);
      
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUser?.id) {
      toast({
        title: 'Error',
        description: 'Cannot delete your own account',
        variant: 'destructive'
      });
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500 hover:bg-red-600">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Manager</Badge>;
      case 'customer':
        return <Badge variant="secondary">Customer</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!currentUser) {
    return <div>Loading user data...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          User Management ({users.length} users)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] overflow-auto">
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found. Loading...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="capitalize">{user.region}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {currentUser?.role === 'admin' && user.id !== currentUser.id && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4">
                <Input
                  placeholder="Name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
                <Input
                  placeholder="Email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
                {currentUser?.role === 'admin' && (
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value: 'admin' | 'manager' | 'customer') => 
                      setEditingUser({...editingUser, role: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Select 
                  value={editingUser.region} 
                  onValueChange={(value) => setEditingUser({...editingUser, region: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="madhya pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSaveUser} disabled={loading} className="w-full">
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
