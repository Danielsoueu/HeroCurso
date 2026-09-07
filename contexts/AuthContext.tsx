import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export interface UserProfile {
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string | any;
}

export const ADMIN_EMAILS = [
  'danielmelo@companyhero.com',
  'danielcontaescolha@gmail.com'
];

export const isSuperAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.some(adminEmail => adminEmail.trim().toLowerCase() === clean);
};

interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = Boolean(
    isSuperAdmin(user?.email) || 
    isSuperAdmin(profile?.email) || 
    profile?.role === 'admin'
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        const userEmail = currentUser.email.trim().toLowerCase();
        const isSuper = isSuperAdmin(userEmail);

        let userProfile: UserProfile = {
          email: userEmail,
          role: isSuper ? 'admin' : 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
        };

        const userDocRef = doc(db, 'users', currentUser.uid);

        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            userProfile = {
              ...data,
              role: isSuper ? 'admin' : (data.role || 'user'),
            };
          }
        } catch (error) {
          console.warn("Could not read user profile from Firestore:", error);
        }

        if (isSuper) {
          userProfile.role = 'admin';
        }

        setProfile(userProfile);
        localStorage.setItem('finhero_user_profile', JSON.stringify(userProfile));

        // Sync with Firestore in background
        try {
          if (isSuper) {
            await setDoc(userDocRef, {
              email: userEmail,
              role: 'admin',
              status: 'active'
            }, { merge: true });
          } else {
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
              await setDoc(userDocRef, {
                email: userEmail,
                role: 'user',
                status: 'active',
                createdAt: serverTimestamp(),
              });
            }
          }
        } catch (syncError) {
          console.warn("Could not sync user profile to Firestore:", syncError);
        }
      } else {
        setProfile(null);
        localStorage.removeItem('finhero_user_profile');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase().trim();
      
      // Allow companyhero.com or the specific admin emails
      if (email && !email.endsWith('@companyhero.com') && !isSuperAdmin(email)) {
        await signOut(auth);
        throw new Error('unauthorized-email');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, signInWithGoogle, logout }}>
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
