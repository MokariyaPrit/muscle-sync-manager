
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('gym_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: string) => {
    // Demo authentication - replace with real API call
    const demoCredentials = {
      'admin@fitzone.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
      'manager@fitzone.com': { password: 'manager123', role: 'manager', name: 'Manager User' },
      'customer@fitzone.com': { password: 'customer123', role: 'customer', name: 'Customer User' }
    };

    const userCreds = demoCredentials[email as keyof typeof demoCredentials];
    
    if (userCreds && userCreds.password === password && userCreds.role === role) {
      const userData: User = {
        id: '1',
        email,
        role: role as 'admin' | 'manager' | 'customer',
        name: userCreds.name
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('gym_user', JSON.stringify(userData));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('gym_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
