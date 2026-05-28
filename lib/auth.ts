import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUser, getUser } from './firestore';

export async function signUp(email: string, password: string, name: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });

  // Create user document in Firestore
  await createUser(cred.user.uid, {
    name,
    email,
    role: 'user',
  });

  return cred.user;
}

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserRole(uid: string): Promise<'user' | 'admin'> {
  const user = await getUser(uid);
  return user?.role || 'user';
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
