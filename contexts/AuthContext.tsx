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

interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        if (currentUser.email) {
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            let userProfile: UserProfile;

            if (userDoc.exists()) {
              userProfile = userDoc.data() as UserProfile;
            } else {
              userProfile = {
                email: currentUser.email,
                role: 'user',
                status: 'active',
                createdAt: serverTimestamp(),
              };
              await setDoc(userDocRef, userProfile);
            }
            
            setProfile(userProfile);
            localStorage.setItem('finhero_user_profile', JSON.stringify(userProfile));
          } catch (error) {
            console.error("Error fetching/creating user profile:", error);
          }
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
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, logout }}>
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
