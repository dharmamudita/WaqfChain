import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '@/lib/midtrans';
import { processSuccessfulPayment, getTransactionByOrderId, updateTransaction } from '@/lib/firestore';
import type { MidtransNotification } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: MidtransNotification = await request.json();

    const {
      transaction_status,
      order_id,
      gross_amount,
      signature_key,
      status_code,
      payment_type,
      fraud_status,
    } = body;

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const isValid = verifySignature(
      order_id,
      status_code,
      gross_amount,
      serverKey,
      signature_key
    );

    if (!isValid) {
      console.error('Invalid Midtrans signature for order:', order_id);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    // Handle transaction status
    if (
      transaction_status === 'settlement' ||
      (transaction_status === 'capture' && fraud_status === 'accept')
    ) {
      // Payment successful
      await processSuccessfulPayment(order_id, order_id, payment_type);

      // Generate QR code URL for certificate
      const tx = await getTransactionByOrderId(order_id);
      if (tx) {
        const qrCodeUrl = `https://waqfchain.com/verify/${tx.txId}`;
        await updateTransaction(tx.txId, { qrCodeUrl });
      }

      console.log('Payment successful for order:', order_id);
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'expire' ||
      transaction_status === 'deny'
    ) {
      // Payment failed
      const tx = await getTransactionByOrderId(order_id);
      if (tx) {
        await updateTransaction(tx.txId, { status: 'failed' });
      }

      console.log('Payment failed for order:', order_id);
    } else if (transaction_status === 'pending') {
      console.log('Payment pending for order:', order_id);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Midtrans notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
