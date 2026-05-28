import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  increment,
  writeBatch,
  setDoc,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Project, Transaction, Chat, Message, DanaUsage, ProjectType } from '@/types';

// ===== USERS =====
export async function createUser(uid: string, data: Omit<User, 'uid' | 'createdAt' | 'totalWakaf'>) {
  await setDoc(doc(db, 'users', uid), {
    uid,
    ...data,
    totalWakaf: 0,
    createdAt: Timestamp.now(),
  });
}

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as User) : null;
}

export async function updateUser(uid: string, data: Partial<User>) {
  await updateDoc(doc(db, 'users', uid), data as DocumentData);
}

// ===== PROJECTS =====
export async function getProjects(filters?: {
  type?: ProjectType;
  status?: string;
  limitCount?: number;
}): Promise<Project[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

  if (filters?.type) {
    constraints.unshift(where('type', '==', filters.type));
  }
  if (filters?.status) {
    constraints.unshift(where('status', '==', filters.status));
  }
  if (filters?.limitCount) {
    constraints.push(limit(filters.limitCount));
  }

  const q = query(collection(db, 'projects'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, 'projects', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Project) : null;
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'collectedAmount' | 'progressPercent'>) {
  const docRef = await addDoc(collection(db, 'projects'), {
    ...data,
    collectedAmount: 0,
    progressPercent: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProject(id: string, data: Partial<Project>) {
  await updateDoc(doc(db, 'projects', id), {
    ...data,
    updatedAt: Timestamp.now(),
  } as DocumentData);
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db, 'projects', id));
}

export function subscribeToProjects(callback: (projects: Project[]) => void) {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
    callback(projects);
  });
}

// ===== TRANSACTIONS =====
export async function createTransaction(data: Omit<Transaction, 'createdAt'>) {
  await setDoc(doc(db, 'transactions', data.txId), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function getTransaction(txId: string): Promise<Transaction | null> {
  const snap = await getDoc(doc(db, 'transactions', txId));
  return snap.exists() ? (snap.data() as Transaction) : null;
}

export async function getTransactionByOrderId(orderId: string): Promise<Transaction | null> {
  const q = query(collection(db, 'transactions'), where('orderId', '==', orderId));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as Transaction);
}

export async function updateTransaction(txId: string, data: Partial<Transaction>) {
  await updateDoc(doc(db, 'transactions', txId), data as DocumentData);
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Transaction);
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Transaction);
}

export async function getProjectDonors(projectId: string): Promise<Transaction[]> {
  const q = query(
    collection(db, 'transactions'),
    where('projectId', '==', projectId),
    where('status', '==', 'success'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Transaction);
}

// ===== CHATS =====
export async function createChat(data: Omit<Chat, 'createdAt' | 'lastMessageAt'>) {
  await setDoc(doc(db, 'chats', data.chatId), {
    ...data,
    createdAt: Timestamp.now(),
    lastMessageAt: Timestamp.now(),
  });
}

export async function getChat(chatId: string): Promise<Chat | null> {
  const snap = await getDoc(doc(db, 'chats', chatId));
  return snap.exists() ? (snap.data() as Chat) : null;
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const q = query(
    collection(db, 'chats'),
    where('userId', '==', userId),
    orderBy('lastMessageAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Chat);
}

export async function getAllChats(): Promise<Chat[]> {
  const q = query(collection(db, 'chats'), orderBy('lastMessageAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Chat);
}

export async function updateChat(chatId: string, data: Partial<Chat>) {
  await updateDoc(doc(db, 'chats', chatId), data as DocumentData);
}

// ===== MESSAGES (Sub-collection) =====
export async function sendMessage(chatId: string, data: Omit<Message, 'createdAt'>) {
  const msgRef = doc(collection(db, 'chats', chatId, 'messages'));
  await setDoc(msgRef, {
    ...data,
    messageId: msgRef.id,
    createdAt: Timestamp.now(),
  });

  // Update parent chat
  await updateChat(chatId, {
    lastMessage: data.text,
    lastMessageAt: Timestamp.now(),
    isRead: data.senderRole === 'admin',
  } as Partial<Chat>);
}

export function subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map((d) => d.data() as Message);
    callback(messages);
  });
}

// ===== DANA USAGE =====
export async function getDanaUsage(projectId?: string): Promise<DanaUsage[]> {
  let q;
  if (projectId) {
    q = query(
      collection(db, 'dana_usage'),
      where('projectId', '==', projectId),
      orderBy('date', 'desc')
    );
  } else {
    q = query(collection(db, 'dana_usage'), orderBy('date', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DanaUsage));
}

export async function createDanaUsage(data: Omit<DanaUsage, 'id'>) {
  const docRef = await addDoc(collection(db, 'dana_usage'), data);
  return docRef.id;
}

// ===== STATS =====
export async function getStats() {
  const projectsSnap = await getDocs(
    query(collection(db, 'projects'), where('status', '==', 'aktif'))
  );

  let totalCollected = 0;
  projectsSnap.docs.forEach((d) => {
    totalCollected += d.data().collectedAmount || 0;
  });

  const txSnap = await getDocs(
    query(collection(db, 'transactions'), where('status', '==', 'success'))
  );

  return {
    totalProjects: projectsSnap.size,
    totalCollected,
    totalDonors: txSnap.size,
  };
}

// ===== BATCH UPDATE FOR WEBHOOK =====
export async function processSuccessfulPayment(
  txId: string,
  orderId: string,
  paymentMethod: string
) {
  const tx = await getTransactionByOrderId(orderId);
  if (!tx) return;

  const batch = writeBatch(db);

  // Update transaction
  batch.update(doc(db, 'transactions', tx.txId), {
    status: 'success',
    paymentMethod,
  });

  // Update project collected amount
  const projectRef = doc(db, 'projects', tx.projectId);
  const projectSnap = await getDoc(projectRef);
  if (projectSnap.exists()) {
    const project = projectSnap.data() as Project;
    const newCollected = project.collectedAmount + tx.amount;
    const newProgress = Math.min(
      Math.round((newCollected / project.targetAmount) * 100),
      100
    );
    batch.update(projectRef, {
      collectedAmount: newCollected,
      progressPercent: newProgress,
      updatedAt: Timestamp.now(),
    });
  }

  // Update user total wakaf
  const userRef = doc(db, 'users', tx.userId);
  batch.update(userRef, {
    totalWakaf: increment(tx.amount),
  });

  await batch.commit();
}
