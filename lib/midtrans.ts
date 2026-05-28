import Midtrans from 'midtrans-client';

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

// Server-side only - Snap client
export const snap = new Midtrans.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
});

export interface CustomerDetails {
  first_name: string;
  email: string;
}

export interface ItemDetail {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export async function createSnapTransaction(
  orderId: string,
  amount: number,
  customerDetails: CustomerDetails,
  itemDetails: ItemDetail[]
) {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: customerDetails,
    item_details: itemDetails,
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/akun`,
    },
  };

  const transaction = await snap.createTransaction(parameter);
  return transaction.token as string;
}

export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WAKAF-${timestamp}-${random}`;
}

export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string
): boolean {
  const crypto = require('crypto');
  const hash = crypto
    .createHash('sha512')
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest('hex');
  return hash === signatureKey;
}
