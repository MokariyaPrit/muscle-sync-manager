
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
  plan: string;
  region: string;
  status: 'active' | 'inactive';
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Manager',
      email: 'manager@fitzone.com',
      role: 'manager',
      plan: 'Premium',
      region: 'North',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Customer',
      email: 'jane@example.com',
      role: 'customer',
      plan: 'Basic',
      region: 'North',
      status: 'active'
    },
    {
      id: '3',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'customer',
      plan: 'Premium',
      region: 'South',
      status: 'inactive'
    }
  ]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
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

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      : <Badge variant="destructive">Inactive</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{user.plan}</TableCell>
                <TableCell>{user.region}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
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
                <Select 
                  value={editingUser.plan} 
                  onValueChange={(value) => setEditingUser({...editingUser, plan: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={editingUser.region} 
                  onValueChange={(value) => setEditingUser({...editingUser, region: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={editingUser.status} 
                  onValueChange={(value: 'active' | 'inactive') => 
                    setEditingUser({...editingUser, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSaveUser} className="w-full">
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
