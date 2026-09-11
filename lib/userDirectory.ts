import { UserProfile } from '../types';

const STORAGE_KEY = 'hero_shared_user_directory';
const CHANNEL_NAME = 'hero_workspace_user_sync_v1';

export const SUPER_ADMIN_EMAIL = 'danielmelo@companyhero.com';
export const TEST_COLLABORATOR_EMAIL = 'danielcontaescolha@gmail.com';

export const INITIAL_SEED_USERS: UserProfile[] = [
  {
    uid: 'corp_danielmelo_companyhero_com',
    email: 'danielmelo@companyhero.com',
    displayName: 'Daniel da Silva Melo',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'active',
    domain: 'companyhero.com',
    createdAt: '2026-09-01T10:00:00.000Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    uid: 'corp_danielcontaescolha_gmail_com',
    email: 'danielcontaescolha@gmail.com',
    displayName: 'Daniel (Conta Escolha)',
    photoURL: '',
    role: 'user', // strictly regular user / colaborador
    status: 'active',
    domain: 'gmail.com',
    createdAt: '2026-09-10T14:30:00.000Z',
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
  }
];

/**
 * Reads users from localStorage shared directory, seeding if empty.
 */
export const getSharedDirectory = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_USERS));
      return [...INITIAL_SEED_USERS];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_USERS));
      return [...INITIAL_SEED_USERS];
    }

    // Ensure super admin and test collaborator are present and correctly typed
    const map = new Map<string, UserProfile>();
    INITIAL_SEED_USERS.forEach(u => map.set(u.email.toLowerCase().trim(), { ...u }));
    
    parsed.forEach((item: any) => {
      if (item && item.email && typeof item.email === 'string') {
        const clean = item.email.toLowerCase().trim();
        const existing = map.get(clean);
        // Daniel Melo is always Super Admin
        const role = clean === SUPER_ADMIN_EMAIL ? 'admin' : (item.role === 'admin' ? 'admin' : 'user');
        map.set(clean, {
          uid: item.uid || existing?.uid || `user_${clean.replace(/[^a-zA-Z0-9]/g, '_')}`,
          email: clean,
          displayName: item.displayName || existing?.displayName || clean.split('@')[0],
          photoURL: item.photoURL || existing?.photoURL || '',
          role,
          status: item.status === 'blocked' ? 'blocked' : 'active',
          domain: item.domain || clean.split('@')[1] || '',
          createdAt: item.createdAt || existing?.createdAt || new Date().toISOString(),
          lastLoginAt: item.lastLoginAt || existing?.lastLoginAt || new Date().toISOString()
        });
      }
    });

    return Array.from(map.values());
  } catch (e) {
    console.warn("Notice reading shared directory:", e);
    return [...INITIAL_SEED_USERS];
  }
};

/**
 * Saves users list into shared localStorage directory.
 */
export const saveSharedDirectory = (users: UserProfile[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Notice saving shared directory:", e);
  }
};

/**
 * Upserts a user in the shared directory and notifies all open tabs/windows.
 */
export const upsertUserInDirectory = (partial: Partial<UserProfile> & { email: string }): UserProfile => {
  const cleanEmail = partial.email.toLowerCase().trim();
  const current = getSharedDirectory();
  const index = current.findIndex(u => u.email.toLowerCase().trim() === cleanEmail);

  const isSuper = cleanEmail === SUPER_ADMIN_EMAIL;
  const domain = cleanEmail.split('@')[1] || '';

  let updatedUser: UserProfile;

  if (index >= 0) {
    const existing = current[index];
    const resolvedRole: 'admin' | 'user' = isSuper 
      ? 'admin' 
      : (partial.role || existing.role || 'user');

    updatedUser = {
      ...existing,
      ...partial,
      email: cleanEmail,
      role: resolvedRole,
      status: partial.status || existing.status || 'active',
      lastLoginAt: partial.lastLoginAt || new Date().toISOString(),
      domain: partial.domain || existing.domain || domain
    };
    current[index] = updatedUser;
  } else {
    updatedUser = {
      uid: partial.uid || `corp_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: cleanEmail,
      displayName: partial.displayName || cleanEmail.split('@')[0],
      photoURL: partial.photoURL || '',
      role: isSuper ? 'admin' : (partial.role || 'user'),
      status: partial.status || 'active',
      domain: partial.domain || domain,
      createdAt: partial.createdAt || new Date().toISOString(),
      lastLoginAt: partial.lastLoginAt || new Date().toISOString()
    };
    current.push(updatedUser);
  }

  saveSharedDirectory(current);
  broadcastUserEvent({ type: 'USER_UPSERTED', user: updatedUser });
  return updatedUser;
};

/**
 * Broadcasts an event across tabs and triggers local storage sync.
 */
export const broadcastUserEvent = (payload: any) => {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      bc.postMessage(payload);
      bc.close();
    }
  } catch (e) {
    // BroadcastChannel unsupported or blocked
  }

  try {
    // Dispatch local custom event for current window
    window.dispatchEvent(new CustomEvent('hero_user_sync', { detail: payload }));
  } catch (e) {
    // ignore
  }
};

/**
 * Subscribes to user sync events across tabs and within the current window.
 */
export const subscribeToUserEvents = (callback: (payload: any) => void): (() => void) => {
  let bc: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (event.data) callback(event.data);
      };
    }
  } catch (e) {
    // ignore
  }

  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail) callback(detail);
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const users = JSON.parse(e.newValue);
        callback({ type: 'DIRECTORY_SYNCED', users });
      } catch (err) {
        // ignore
      }
    }
  };

  window.addEventListener('hero_user_sync', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (bc) {
      bc.close();
    }
    window.removeEventListener('hero_user_sync', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};
