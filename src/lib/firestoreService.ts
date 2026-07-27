import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  getDocs,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Bill, NotificationItem, UserProfile } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Details:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Recursively strips undefined properties from an object/array so Firestore setDoc / updateDoc does not throw unsupported field errors.
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === undefined) return null as any;
  if (obj === null) return null as any;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined && item !== null) as any;
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = sanitizeForFirestore(value);
    }
  }
  return cleaned as T;
}

// Helper to wrap promises with a timeout for graceful offline execution
function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timed out (offline mode)')), ms)
    ),
  ]);
}

// --- User Profile ---
export async function createUserDocument(
  uid: string,
  name: string,
  email: string
): Promise<UserProfile> {
  const profile: UserProfile = {
    name,
    email,
    currency: 'PKR',
    currentHealthScore: 0,
    onboardingCompleted: true,
    preferences: {
      darkMode: 'light',
      notifications: {
        anomalyAlerts: true,
        reminders: true,
        tips: true,
        weeklySummary: true,
      },
    },
  };

  try {
    localStorage.setItem(`billwise_profile_${uid}`, JSON.stringify(profile));
  } catch (e) {}

  try {
    const userRef = doc(db, 'users', uid);
    const dataToSave = sanitizeForFirestore({
      ...profile,
      uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await withTimeout(setDoc(userRef, dataToSave), 4000);
    console.log('[Firestore Write Success] User document saved:', uid);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    console.warn('Firestore user document creation operating in offline mode.');
  }

  return profile;
}

export function subscribeUserProfile(
  userId: string,
  onUpdate: (profile: UserProfile | null) => void
) {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        try {
          localStorage.setItem(`billwise_profile_${userId}`, JSON.stringify(data));
        } catch (e) {}
        onUpdate(data);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${userId}`);
      console.warn('Firestore profile listener notice:', err.message);
    }
  );
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await withTimeout(getDoc(userRef), 4000);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${userId}`);
    console.warn('Error fetching user profile from Firestore:', err);
    return null;
  }
}

export async function saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
  try {
    localStorage.setItem(`billwise_profile_${userId}`, JSON.stringify(profile));
  } catch (e) {}

  try {
    const userRef = doc(db, 'users', userId);
    const payload = sanitizeForFirestore({
      ...profile,
      updatedAt: new Date().toISOString(),
    });
    await withTimeout(setDoc(userRef, payload, { merge: true }), 4000);
    console.log('[Firestore Write Success] User profile updated:', userId);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${userId}`);
    console.warn('Firestore profile save operating in offline mode.');
  }
}

// --- Bills ---
export function subscribeUserBills(
  userId: string,
  onUpdate: (bills: Bill[]) => void,
  onError?: (error: Error) => void
) {
  const billsRef = collection(db, 'bills');
  const q = query(billsRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const bills: Bill[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const { userId: _, ...billData } = data;
        bills.push({ ...billData, id: docSnap.id } as Bill);
      });
      bills.sort(
        (a, b) =>
          new Date(b.billDate || b.createdAt).getTime() -
          new Date(a.billDate || a.createdAt).getTime()
      );
      try {
        localStorage.setItem(`billwise_bills_${userId}`, JSON.stringify(bills));
      } catch (e) {}
      onUpdate(bills);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'bills');
      console.warn('Firestore bills listener notice:', err.message);
      if (onError) onError(err);
    }
  );
}

export async function saveBillToFirestore(userId: string, bill: Bill): Promise<void> {
  try {
    const cacheKey = `billwise_bills_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    const list: Bill[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex((b) => b.id === bill.id);
    if (idx >= 0) {
      list[idx] = bill;
    } else {
      list.unshift(bill);
    }
    localStorage.setItem(cacheKey, JSON.stringify(list));
  } catch (e) {}

  try {
    const billRef = doc(db, 'bills', bill.id);
    const payload = sanitizeForFirestore({
      ...bill,
      userId,
      createdAt: bill.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await withTimeout(setDoc(billRef, payload), 4000);
    console.log('[Firestore Write Success] Bill saved:', bill.id);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `bills/${bill.id}`);
    console.warn('Firestore save bill operating in offline mode.');
  }
}

export async function deleteBillFromFirestore(billId: string, userId?: string): Promise<void> {
  if (userId) {
    try {
      const cacheKey = `billwise_bills_${userId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const list: Bill[] = JSON.parse(cached);
        const filtered = list.filter((b) => b.id !== billId);
        localStorage.setItem(cacheKey, JSON.stringify(filtered));
      }
    } catch (e) {}
  }

  try {
    const billRef = doc(db, 'bills', billId);
    await withTimeout(deleteDoc(billRef), 4000);
    console.log('[Firestore Write Success] Bill deleted:', billId);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `bills/${billId}`);
    console.warn('Firestore delete bill operating in offline mode.');
  }
}

// --- Notifications ---
export function subscribeUserNotifications(
  userId: string,
  onUpdate: (notificationItems: NotificationItem[]) => void
) {
  const notifRef = collection(db, 'notifications');
  const q = query(notifRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: NotificationItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const { userId: _, ...notifData } = data;
        items.push({ ...notifData, id: docSnap.id } as NotificationItem);
      });
      items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      try {
        localStorage.setItem(`billwise_notifs_${userId}`, JSON.stringify(items));
      } catch (e) {}
      onUpdate(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'notifications');
      console.warn('Firestore notifications listener notice:', err.message);
    }
  );
}

export async function saveNotificationToFirestore(
  userId: string,
  notification: NotificationItem
): Promise<void> {
  try {
    const cacheKey = `billwise_notifs_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    const list: NotificationItem[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex((n) => n.id === notification.id);
    if (idx >= 0) {
      list[idx] = notification;
    } else {
      list.unshift(notification);
    }
    localStorage.setItem(cacheKey, JSON.stringify(list));
  } catch (e) {}

  try {
    const notifRef = doc(db, 'notifications', notification.id);
    const payload = sanitizeForFirestore({
      ...notification,
      userId,
    });
    await withTimeout(setDoc(notifRef, payload), 4000);
    console.log('[Firestore Write Success] Notification saved:', notification.id);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `notifications/${notification.id}`);
    console.warn('Firestore save notification operating in offline mode.');
  }
}

export async function markNotificationReadInFirestore(
  notificationId: string,
  userId?: string
): Promise<void> {
  if (userId) {
    try {
      const cacheKey = `billwise_notifs_${userId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const list: NotificationItem[] = JSON.parse(cached);
        const updated = list.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n));
        localStorage.setItem(cacheKey, JSON.stringify(updated));
      }
    } catch (e) {}
  }

  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await withTimeout(updateDoc(notifRef, { isRead: true }), 4000);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `notifications/${notificationId}`);
    console.warn('Firestore mark read operating in offline mode.');
  }
}

export async function markAllNotificationsReadInFirestore(userId: string): Promise<void> {
  try {
    const cacheKey = `billwise_notifs_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const list: NotificationItem[] = JSON.parse(cached);
      const updated = list.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem(cacheKey, JSON.stringify(updated));
    }
  } catch (e) {}

  try {
    const notifRef = collection(db, 'notifications');
    const q = query(notifRef, where('userId', '==', userId));
    const snap = await withTimeout(getDocs(q), 4000);
    const batch = writeBatch(db);
    snap.forEach((d) => {
      batch.update(d.ref, { isRead: true });
    });
    await withTimeout(batch.commit(), 4000);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, 'notifications');
    console.warn('Firestore mark all read operating in offline mode.');
  }
}

