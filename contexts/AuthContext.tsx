import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile, WorkspaceSettings } from '../types';

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

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettings = {
  domainRestrictionEnabled: false,
  allowedDomain: 'companyhero.com',
  allowedEmails: ['danielcontaescolha@gmail.com', 'danielmelo@companyhero.com'],
  updatedAt: new Date().toISOString()
};

interface AuthContextProps {
  user: User | AuthUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  workspaceSettings: WorkspaceSettings | null;
  signInWithGoogle: () => Promise<void>;
  signInWithCorporateEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateWorkspaceSettings: (settings: Partial<WorkspaceSettings>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Read and listen to Workspace Settings in real-time
  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'workspace');
    const unsubscribe = onSnapshot(settingsRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data() as WorkspaceSettings;
        setWorkspaceSettings(data);
      } else {
        // Initialize default workspace settings if not created yet
        try {
          await setDoc(settingsRef, DEFAULT_WORKSPACE_SETTINGS, { merge: true });
        } catch (e) {
          console.warn("Could not bootstrap workspace settings:", e);
        }
        setWorkspaceSettings(DEFAULT_WORKSPACE_SETTINGS);
      }
    }, (err) => {
      console.warn("Notice reading workspace settings:", err);
      setWorkspaceSettings(DEFAULT_WORKSPACE_SETTINGS);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(
    isSuperAdmin(user?.email) || 
    isSuperAdmin(profile?.email) || 
    profile?.role === 'admin'
  );

  const isAuthenticated = Boolean(user && profile?.status !== 'blocked');

  // Verify domain restriction and allowed emails
  const checkDomainPermission = (email: string, settings: WorkspaceSettings | null): { allowed: boolean; reason?: string } => {
    const cleanEmail = email.toLowerCase().trim();
    if (isSuperAdmin(cleanEmail)) {
      return { allowed: true };
    }

    if (!settings || !settings.domainRestrictionEnabled) {
      return { allowed: true };
    }

    // Check whitelist of exceptions
    if (settings.allowedEmails && settings.allowedEmails.some(e => e.toLowerCase().trim() === cleanEmail)) {
      return { allowed: true };
    }

    // Check domain match
    const userDomain = cleanEmail.split('@')[1] || '';
    const mainAllowedDomain = (settings.allowedDomain || 'companyhero.com').toLowerCase().replace(/^@/, '').trim();

    if (userDomain === mainAllowedDomain || userDomain === 'companyhero.com' || userDomain === 'companyhero.com.br') {
      return { allowed: true };
    }

    return { allowed: false, reason: 'unauthorized-domain' };
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    let isMounted = true;
    let unsubscribeProfileListener: (() => void) | null = null;

    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 4000);

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (unsubscribeProfileListener) {
        unsubscribeProfileListener();
        unsubscribeProfileListener = null;
      }

      if (currentUser && currentUser.email) {
        const userEmail = currentUser.email.toLowerCase().trim();
        const userUid = currentUser.uid;
        const isSuper = isSuperAdmin(userEmail);
        const domain = userEmail.split('@')[1] || '';

        // Attach Realtime Listener on user profile in Firestore
        const userRef = doc(db, 'users', userUid);
        unsubscribeProfileListener = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            const profileData = docSnap.data() as UserProfile;
            
            // Protection in real-time: if blocked by admin, log out immediately
            if (profileData.status === 'blocked') {
              if (isMounted) {
                logout();
              }
              return;
            }

            const mergedProfile: UserProfile = {
              uid: userUid,
              email: userEmail,
              displayName: profileData.displayName || currentUser.displayName || userEmail.split('@')[0],
              photoURL: profileData.photoURL || currentUser.photoURL || '',
              role: isSuper ? 'admin' : (profileData.role || 'user'),
              status: profileData.status || 'active',
              domain: profileData.domain || domain,
              createdAt: profileData.createdAt || new Date().toISOString(),
              lastLoginAt: profileData.lastLoginAt || new Date().toISOString()
            };

            if (isMounted) {
              setUser(currentUser);
              setProfile(mergedProfile);
              localStorage.setItem('finhero_user_profile', JSON.stringify(mergedProfile));
              setLoading(false);
            }
          } else {
            // First time login - auto create profile in Firestore
            const initialRole: 'admin' | 'user' = isSuper ? 'admin' : 'user';
            const newProfile: UserProfile = {
              uid: userUid,
              email: userEmail,
              displayName: currentUser.displayName || userEmail.split('@')[0],
              photoURL: currentUser.photoURL || '',
              role: initialRole,
              status: 'active',
              domain,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };

            try {
              await setDoc(userRef, newProfile, { merge: true });
            } catch (err) {
              console.warn("Notice creating new profile in Firestore:", err);
            }

            if (isMounted) {
              setUser(currentUser);
              setProfile(newProfile);
              localStorage.setItem('finhero_user_profile', JSON.stringify(newProfile));
              setLoading(false);
            }
          }
        }, (err) => {
          console.warn("Profile listener notice:", err);
          // Fallback if permission or network fails
          const fallbackProfile: UserProfile = {
            uid: userUid,
            email: userEmail,
            displayName: currentUser.displayName || userEmail.split('@')[0],
            photoURL: currentUser.photoURL || '',
            role: isSuper ? 'admin' : 'user',
            status: 'active',
            domain,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          if (isMounted) {
            setUser(currentUser);
            setProfile(fallbackProfile);
            setLoading(false);
          }
        });

        // Update lastLoginAt in Firestore
        setDoc(userRef, {
          email: userEmail,
          displayName: currentUser.displayName || userEmail.split('@')[0],
          photoURL: currentUser.photoURL || '',
          lastLoginAt: new Date().toISOString(),
          domain
        }, { merge: true }).catch(() => {});

      } else {
        // Check corporate email session in localStorage
        try {
          const savedSession = localStorage.getItem('finhero_corporate_session');
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            if (parsed?.user?.email && isMounted) {
              const corpEmail = parsed.user.email.toLowerCase().trim();
              const corpUid = parsed.user.uid;
              const isSuper = isSuperAdmin(corpEmail);

              // Realtime listener for corporate session
              const corpRef = doc(db, 'users', corpUid);
              unsubscribeProfileListener = onSnapshot(corpRef, (snap) => {
                if (snap.exists()) {
                  const data = snap.data() as UserProfile;
                  if (data.status === 'blocked') {
                    logout();
                    return;
                  }
                  const updated: UserProfile = {
                    ...data,
                    role: isSuper ? 'admin' : (data.role || 'user')
                  };
                  setUser(parsed.user);
                  setProfile(updated);
                  setLoading(false);
                }
              }, () => {});

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
      if (unsubscribeProfileListener) unsubscribeProfileListener();
      unsubscribeAuth();
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

      // 1. Check workspace settings & domain restriction
      let currentSettings = workspaceSettings;
      if (!currentSettings) {
        try {
          const snap = await getDoc(doc(db, 'settings', 'workspace'));
          if (snap.exists()) currentSettings = snap.data() as WorkspaceSettings;
        } catch (e) {
          // ignore
        }
      }

      const domainCheck = checkDomainPermission(email, currentSettings);
      if (!domainCheck.allowed) {
        await signOut(auth);
        throw new Error('unauthorized-domain');
      }

      // 2. Check user status in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);

      const isSuper = isSuperAdmin(email);
      const domain = email.split('@')[1] || '';

      if (userSnap.exists()) {
        const existing = userSnap.data() as UserProfile;
        if (existing.status === 'blocked') {
          await signOut(auth);
          throw new Error('inactive-user');
        }

        // Update last login
        const role = isSuper ? 'admin' : (existing.role || 'user');
        const updated: UserProfile = {
          uid: result.user.uid,
          email,
          displayName: result.user.displayName || existing.displayName || email.split('@')[0],
          photoURL: result.user.photoURL || existing.photoURL || '',
          role,
          status: 'active',
          domain,
          createdAt: existing.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        await setDoc(userRef, updated, { merge: true });
        setUser(result.user);
        setProfile(updated);
        localStorage.setItem('finhero_user_profile', JSON.stringify(updated));
      } else {
        // Auto register new user
        const role: 'admin' | 'user' = isSuper ? 'admin' : 'user';
        const newProfile: UserProfile = {
          uid: result.user.uid,
          email,
          displayName: result.user.displayName || email.split('@')[0],
          photoURL: result.user.photoURL || '',
          role,
          status: 'active',
          domain,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        await setDoc(userRef, newProfile, { merge: true });
        setUser(result.user);
        setProfile(newProfile);
        localStorage.setItem('finhero_user_profile', JSON.stringify(newProfile));
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

    // Check workspace settings & domain restriction
    let currentSettings = workspaceSettings;
    if (!currentSettings) {
      try {
        const snap = await getDoc(doc(db, 'settings', 'workspace'));
        if (snap.exists()) currentSettings = snap.data() as WorkspaceSettings;
      } catch (e) {
        // ignore
      }
    }

    const domainCheck = checkDomainPermission(cleanEmail, currentSettings);
    if (!domainCheck.allowed) {
      throw new Error('unauthorized-domain');
    }

    const isSuper = isSuperAdmin(cleanEmail);
    const domain = cleanEmail.split('@')[1] || '';
    const uid = 'corp_' + cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Check if user is registered in Firestore
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const existing = userSnap.data() as UserProfile;
      if (existing.status === 'blocked') {
        throw new Error('inactive-user');
      }
    }

    const authUser: AuthUser = {
      uid,
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0]
    };

    const role: 'admin' | 'user' = isSuper ? 'admin' : (userSnap.exists() ? (userSnap.data() as any).role || 'user' : 'user');

    const userProfile: UserProfile = {
      uid,
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      role,
      status: 'active',
      domain,
      createdAt: userSnap.exists() ? (userSnap.data() as any).createdAt || new Date().toISOString() : new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    setUser(authUser);
    setProfile(userProfile);
    localStorage.setItem('finhero_corporate_session', JSON.stringify({ user: authUser, profile: userProfile }));
    localStorage.setItem('finhero_user_profile', JSON.stringify(userProfile));

    // Sync to Firestore in background
    try {
      await setDoc(userRef, userProfile, { merge: true });
    } catch (syncErr) {
      console.warn("Notice syncing corporate login to Firestore:", syncErr);
    }
  };

  const updateWorkspaceSettings = async (newSettings: Partial<WorkspaceSettings>) => {
    try {
      const settingsRef = doc(db, 'settings', 'workspace');
      const payload: WorkspaceSettings = {
        ...(workspaceSettings || DEFAULT_WORKSPACE_SETTINGS),
        ...newSettings,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'admin'
      };
      await setDoc(settingsRef, payload, { merge: true });
      setWorkspaceSettings(payload);
    } catch (err) {
      console.error("Error updating workspace settings:", err);
      throw err;
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
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      isAdmin, 
      isAuthenticated, 
      loading, 
      workspaceSettings, 
      signInWithGoogle, 
      signInWithCorporateEmail, 
      logout,
      updateWorkspaceSettings 
    }}>
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
