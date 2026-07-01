import { Timestamp } from 'firebase/firestore';

// ===== USER =====
export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  totalWakaf: number;
  createdAt: Timestamp;
}

// ===== PROJECT =====
export type ProjectType = string;
export type ProjectStatus = 'aktif' | 'selesai' | 'ditangguhkan';

export interface ProjectLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  targetAmount: number;
  collectedAmount: number;
  progressPercent: number;
  mediaUrls: string[];
  location: ProjectLocation;
  status: ProjectStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===== TRANSACTION =====
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface Transaction {
  txId: string;
  orderId: string;
  userId: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  percentage: number;
  qrCodeUrl: string;
  paymentMethod: string;
  status: TransactionStatus;
  midtransToken?: string;
  donorName?: string;
  manualReceiptUrl?: string;
  message?: string;
  createdAt: Timestamp;
}

// ===== CHAT =====
export interface Chat {
  chatId: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageAt: Timestamp;
  isRead: boolean;
  createdAt: Timestamp;
}

export interface Message {
  messageId: string;
  senderId: string;
  senderRole: 'user' | 'admin';
  text: string;
  createdAt: Timestamp;
}

// ===== DANA USAGE =====
export type DanaUsageType = 'penggunaan' | 'penyerahan';

export interface DanaUsage {
  id: string;
  projectId: string;
  category: string;
  amount: number;
  description: string;
  receiptUrl: string;
  usageType: DanaUsageType;
  date: Timestamp;
}

// ===== PROJECT CATEGORY =====
export interface ProjectCategory {
  id: string;
  label: string;
  icon: string;
  createdAt: Timestamp;
}

// ===== MIDTRANS =====
export interface MidtransNotification {
  transaction_status: string;
  order_id: string;
  gross_amount: string;
  signature_key: string;
  status_code: string;
  payment_type: string;
  fraud_status?: string;
}

// ===== HELPER TYPES =====
export interface CreateTransactionRequest {
  userId: string;
  projectId: string;
  amount: number;
}

export interface CreateTransactionResponse {
  snapToken: string;
  orderId: string;
  txId: string;
}

// Extend Window for Midtrans Snap
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: Record<string, unknown>) => void;
          onPending?: (result: Record<string, unknown>) => void;
          onError?: (result: Record<string, unknown>) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}
