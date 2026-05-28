import { NextRequest, NextResponse } from 'next/server';
import { createSnapTransaction, generateOrderId } from '@/lib/midtrans';
import { createTransaction, getProject, getUser } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, projectId, amount } = body;

    if (!userId || !projectId || !amount) {
      return NextResponse.json(
        { error: 'userId, projectId, dan amount wajib diisi' },
        { status: 400 }
      );
    }

    if (amount < 10000) {
      return NextResponse.json(
        { error: 'Minimal wakaf Rp10.000' },
        { status: 400 }
      );
    }

    // Get project & user data
    const [project, user] = await Promise.all([
      getProject(projectId),
      getUser(userId),
    ]);

    if (!project) {
      return NextResponse.json(
        { error: 'Proyek tidak ditemukan' },
        { status: 404 }
      );
    }

    // Generate unique order ID
    const orderId = generateOrderId();
    const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Calculate contribution percentage
    const percentage = parseFloat(
      ((amount / project.targetAmount) * 100).toFixed(4)
    );

    // Create Midtrans snap token
    const snapToken = await createSnapTransaction(
      orderId,
      amount,
      {
        first_name: user?.name || 'Wakif',
        email: user?.email || 'wakif@waqfchain.com',
      },
      [
        {
          id: projectId,
          price: amount,
          quantity: 1,
          name: `Wakaf - ${project.title}`.substring(0, 50),
        },
      ]
    );

    // Save transaction to Firestore
    await createTransaction({
      txId,
      orderId,
      userId,
      projectId,
      projectTitle: project.title,
      amount,
      percentage,
      qrCodeUrl: '',
      paymentMethod: '',
      status: 'pending',
      midtransToken: snapToken,
    });

    return NextResponse.json({
      snapToken,
      orderId,
      txId,
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat transaksi' },
      { status: 500 }
    );
  }
}
