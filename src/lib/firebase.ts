import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Initialize analytics safely if supported in client environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// Use long polling auto-detection for Firestore to avoid 10-second WebSocket connection timeouts
let db: ReturnType<typeof getFirestore>;
try {
  const customDbId =
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined;

  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, customDbId);
} catch (err) {
  db =
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
}

const storage = getStorage(app);

export async function uploadImageToStorage(path: string, dataUrl: string): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return dataUrl || '';
  }
  try {
    const storageRef = ref(storage, path);
    await uploadString(storageRef, dataUrl, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('[Firebase Storage] Write success! File uploaded to:', path, downloadUrl);
    return downloadUrl;
  } catch (err) {
    console.warn('[Firebase Storage] Storage upload warning/fallback:', err);
    return dataUrl;
  }
}

export {
  app,
  auth,
  db,
  storage,
  analytics,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
};
export type { User };

