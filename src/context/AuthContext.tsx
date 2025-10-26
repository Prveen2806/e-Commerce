import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getUser, createUser, User as AppUser } from '../api/services';
import { message } from 'antd';
import { auth, googleProvider } from '@/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAppUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAppUser = async (uid: string) => {
    try {
      const response = await getUser(uid);
      setAppUser(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Create new user in db
        const newUser: AppUser = {
          id: uid,
          email: user?.email || '',
          name: user?.displayName || '',
          wishlist: [],
          addresses: [],
        };
        await createUser(newUser);
        setAppUser(newUser);
      }
    }
  };

  const refreshAppUser = async () => {
    if (user) {
      await fetchAppUser(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchAppUser(firebaseUser.uid);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  });

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      message.success('Successfully logged in!');
      await fetchAppUser(result.user.uid);
    } catch (error) {
      message.error(error.message || 'Failed to login');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAppUser(null);
      message.success('Successfully logged out!');
    } catch (error) {
      message.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, loginWithGoogle, logout, refreshAppUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function  useAuth(){
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
