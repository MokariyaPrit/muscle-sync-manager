
import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
  name: string;
  region: string;
  profileUrl?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading:boolean;
}
  
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // console.log('AuthProvider state:', { user, isAuthenticated, loading });

useEffect(() => {
  const savedUser = localStorage.getItem('gym_user');
  if (savedUser) {
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    setIsAuthenticated(true);
  }

  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('gym_user');
    } else {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const fullUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          role: userData.role,
          name: userData.name,
          region: userData.region,
          profileUrl: userData?.profileUrl || "",
          phone:userData?.phone || ""
        
        };
        setUser(fullUser);
        setIsAuthenticated(true);
        localStorage.setItem('gym_user', JSON.stringify(fullUser));
      }
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);


  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const fullUser: User = {
        id: user.uid,
        email: user.email ?? '',
        role: userData.role,
        name: userData.name,
        region: userData.region,
        profileUrl: userData?.profileUrl || "" ,
         phone:userData?.phone || "",
      };
      console.log('User logged in successfully:', fullUser);
      setUser(fullUser);
      setIsAuthenticated(true);
      localStorage.setItem('gym_user', JSON.stringify(fullUser));
    } else {
      throw new Error('User data not found in Firestore');
    }
  };

  const logout = async () => {
    console.log('Logging out user');
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('gym_user');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
