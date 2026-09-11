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

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
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

export const isCompanyDomain = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean.endsWith('@companyhero.com') || clean.endsWith('@companyhero.com.br');
};

interface AuthContextProps {
  user: User | AuthUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithCorporateEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = Boolean(
    isSuperAdmin(user?.email) || 
    isSuperAdmin(profile?.email) || 
    profile?.role === 'admin'
  );

  // Helper to query firestore for pre-registered user by email or UID
  const getRegisteredUserData = async (email: string, uid?: string): Promise<UserProfile | null> => {
    const cleanEmail = email.trim().toLowerCase();
    const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');

    // 1. Try UID doc
    if (uid) {
      try {
        const uidSnap = await getDoc(doc(db, 'users', uid));
        if (uidSnap.exists()) {
          return uidSnap.data() as UserProfile;
        }
      } catch (e) {
        console.warn("Could not fetch user by uid:", e);
      }
    }

    // 2. Try sanitized email doc
    try {
      const emailSnap = await getDoc(doc(db, 'users', docId));
      if (emailSnap.exists()) {
        return emailSnap.data() as UserProfile;
      }
    } catch (e) {
      console.warn("Could not fetch user by email doc:", e);
    }

    // 3. Fallback: check hero_users_cache from localStorage
    try {
      const cached = localStorage.getItem('hero_users_cache');
      if (cached) {
        const list = JSON.parse(cached);
        if (Array.isArray(list)) {
          const found = list.find((u: any) => u.email?.toLowerCase().trim() === cleanEmail);
          if (found) {
            return {
              email: cleanEmail,
              role: found.role || 'user',
              status: found.status || 'active',
              createdAt: found.createdAt || new Date().toISOString()
            };
          }
        }
      }
    } catch (e) {
      // ignore
    }

    return null;
  };

  const verifyAuthorization = async (email: string, uid?: string): Promise<{ authorized: boolean; role: 'admin' | 'user'; status: 'active' | 'inactive'; reason?: string }> => {
    const clean = email.trim().toLowerCase();
    if (isSuperAdmin(clean)) {
      return { authorized: true, role: 'admin', status: 'active' };
    }

    // Check Firestore user registry
    const registered = await getRegisteredUserData(clean, uid);
    if (registered) {
      if (registered.status === 'inactive') {
        return { authorized: false, role: registered.role || 'user', status: 'inactive', reason: 'inactive' };
      }
      return { authorized: true, role: registered.role || 'user', status: 'active' };
    }

    // Check Company Hero official corporate domains
    if (isCompanyDomain(clean)) {
      return { authorized: true, role: 'user', status: 'active' };
    }

    return { authorized: false, role: 'user', status: 'active', reason: 'unauthorized-email' };
  };

  useEffect(() => {
    let isMounted = true;

    // Safety timeout to avoid getting stuck in loading
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 4000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email) {
        const userEmail = currentUser.email.trim().toLowerCase();
        const isSuper = isSuperAdmin(userEmail);

        let resolvedRole: 'admin' | 'user' = isSuper ? 'admin' : 'user';
        let resolvedStatus: 'active' | 'inactive' = 'active';

        try {
          const registered = await getRegisteredUserData(userEmail, currentUser.uid);
          if (registered) {
            resolvedRole = isSuper ? 'admin' : (registered.role || 'user');
            resolvedStatus = registered.status || 'active';
          }
        } catch (e) {
          console.warn("Error reading user profile:", e);
        }

        const userProfile: UserProfile = {
          email: userEmail,
          role: resolvedRole,
          status: resolvedStatus,
          createdAt: new Date().toISOString()
        };

        if (isMounted) {
          setUser(currentUser);
          setProfile(userProfile);
          localStorage.setItem('finhero_user_profile', JSON.stringify(userProfile));
          setLoading(false);
        }

        // Background sync to Firestore without blocking UI
        try {
          const uidRef = doc(db, 'users', currentUser.uid);
          await setDoc(uidRef, {
            email: userEmail,
            role: resolvedRole,
            status: resolvedStatus,
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (syncErr) {
          console.warn("Background sync notice:", syncErr);
        }
      } else {
        // If not authenticated in Firebase Auth, check local corporate session
        try {
          const savedSession = localStorage.getItem('finhero_corporate_session');
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            if (parsed?.user?.email && isMounted) {
              setUser(parsed.user);
              setProfile(parsed.profile);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          // ignore
        }

        if (isMounted) {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('finhero_user_profile');
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase().trim();
      
      if (!email) {
        await signOut(auth);
        throw new Error('unauthorized-email');
      }

      const authCheck = await verifyAuthorization(email, result.user.uid);
      if (!authCheck.authorized) {
        await signOut(auth);
        throw new Error(authCheck.reason === 'inactive' ? 'inactive-user' : 'unauthorized-email');
      }

      const isSuper = isSuperAdmin(email);
      const role = isSuper ? 'admin' : authCheck.role;
      const userProfile: UserProfile = {
        email,
        role,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      setUser(result.user);
      setProfile(userProfile);
      localStorage.setItem('finhero_user_profile', JSON.stringify(userProfile));

      // Sync Firestore profile
      try {
        const uidRef = doc(db, 'users', result.user.uid);
        await setDoc(uidRef, {
          email,
          role,
          status: 'active',
          lastLogin: new Date().toISOString()
        }, { merge: true });
      } catch (syncErr) {
        console.warn("Could not sync user profile:", syncErr);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const signInWithCorporateEmail = async (rawEmail: string) => {
    const cleanEmail = rawEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('invalid-format');
    }

    const authCheck = await verifyAuthorization(cleanEmail);
    if (!authCheck.authorized) {
      throw new Error(authCheck.reason === 'inactive' ? 'inactive-user' : 'unauthorized-email');
    }

    const isSuper = isSuperAdmin(cleanEmail);
    const role = isSuper ? 'admin' : authCheck.role;
    const uid = 'corp_' + cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');

    const authUser: AuthUser = {
      uid,
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0]
    };

    const userProfile: UserProfile = {
      email: cleanEmail,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setUser(authUser);
    setProfile(userProfile);
    localStorage.setItem('finhero_corporate_session', JSON.stringify({ user: authUser, profile: userProfile }));
    localStorage.setItem('finhero_user_profile', JSON.stringify(userProfile));

    // Sync to Firestore in background
    try {
      const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
      await setDoc(doc(db, 'users', docId), {
        email: cleanEmail,
        role,
        status: 'active',
        lastLogin: new Date().toISOString()
      }, { merge: true });
    } catch (syncErr) {
      console.warn("Notice syncing corporate login to Firestore:", syncErr);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('finhero_corporate_session');
    localStorage.removeItem('finhero_user_profile');
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, signInWithGoogle, signInWithCorporateEmail, logout }}>
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
