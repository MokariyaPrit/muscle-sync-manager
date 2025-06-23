import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || !region) {
      alert('Please select role and region');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const normalizedRole = role.toLowerCase();
      const normalizedRegion = region.toLowerCase();

      console.log('User UID:', user.uid);
      console.log('Writing to Firestore...');

      await setDoc(doc(db, 'users', user.uid), {
        email,
        name,
        role: normalizedRole,
        region: normalizedRegion,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem(
        'gym_user',
        JSON.stringify({ id: user.uid, email, name, role: normalizedRole, region: normalizedRegion })
      );

      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label className="text-white">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label className="text-white">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label className="text-white">Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <Label className="text-white">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-white/10 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-white/10 text-white">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
   