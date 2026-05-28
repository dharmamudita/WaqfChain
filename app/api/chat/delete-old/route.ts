import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, writeBatch, Timestamp, collectionGroup } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    // Verify secret header
    const secret = request.headers.get('x-delete-secret');
    if (secret !== process.env.CHAT_DELETE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const thirtyDaysAgo = Timestamp.fromDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    // Query old messages using collection group
    const messagesQuery = query(
      collectionGroup(db, 'messages'),
      where('createdAt', '<', thirtyDaysAgo)
    );

    const snapshot = await getDocs(messagesQuery);

    if (snapshot.empty) {
      return NextResponse.json({
        message: 'Tidak ada pesan lama yang perlu dihapus',
        deleted: 0,
      });
    }

    // Batch delete (max 500 per batch)
    let deletedCount = 0;
    let batch = writeBatch(db);
    let batchCount = 0;

    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
      batchCount++;
      deletedCount++;

      if (batchCount >= 500) {
        await batch.commit();
        batch = writeBatch(db);
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      message: `Berhasil menghapus ${deletedCount} pesan lama`,
      deleted: deletedCount,
    });
  } catch (error) {
    console.error('Chat cleanup error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus pesan lama' },
      { status: 500 }
    );
  }
}
