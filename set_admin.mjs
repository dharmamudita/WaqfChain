import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setAdmin() {
  const q = query(collection(db, 'users'), where('email', '==', 'hani@gmail.com'));
  const snap = await getDocs(q);
  
  if (snap.empty) {
    console.log("User not found!");
    return;
  }
  
  for (const docSnap of snap.docs) {
    await updateDoc(docSnap.ref, { role: 'admin' });
    console.log(`Updated user ${docSnap.id} to admin!`);
  }
}

setAdmin().catch(console.error);
