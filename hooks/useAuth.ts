'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange } from '@/lib/auth';
import { getUser } from '@/lib/firestore';
import type { User } from '@/types';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUserData: (data: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  userData: null,
  loading: true,
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setUserData: (data) => set({ userData: data }),
  setLoading: (loading) => set({ loading }),
}));

export function useAuth() {
  const { firebaseUser, userData, loading, setFirebaseUser, setUserData, setLoading } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const data = await getUser(user.uid);
          setUserData(data);
        } catch {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setUserData, setLoading]);

  return {
    user: firebaseUser,
    userData,
    loading,
    isAdmin: userData?.role === 'admin',
    isAuthenticated: !!firebaseUser,
  };
}
