import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);

      const storedUser = localStorage.getItem('gym_user');
      if (!storedUser) throw new Error('User data not found');

      const user = JSON.parse(storedUser);
      const role = user.role;

      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'manager':
          navigate('/manager');
          break;
        case 'customer':
          navigate('/customer');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Dumbbell className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-white">FitZone Pro</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to your account</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/10 border-white/20 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/10 border-white/20 text-white" />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-orange-400 hover:text-orange-300">Sign up</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
