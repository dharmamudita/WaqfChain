'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import { getTransaction } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import CertificateCard from '@/components/token/CertificateCard';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { Transaction } from '@/types';
import { Timestamp } from 'firebase/firestore';
import { PartyPopper, Download } from 'lucide-react';


export default function TokenPage() {
  const params = useParams();
  const txId = params?.id as string;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const { userData } = useAuth();

  useEffect(() => {
    if (txId) {
      getTransaction(txId)
        .then((tx) => setTransaction(tx))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [txId]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: '#ffffff',
        useCORS: true,
      } as Parameters<typeof html2canvas>[1]);
      const link = document.createElement('a');
      link.download = `sertifikat-wakaf-${txId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Sertifikat berhasil diunduh');
    } catch {
      toast.error('Gagal mengunduh sertifikat');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full" />
      </div>
    );
  }

  if (!transaction) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50/30 py-8 md:py-12">
      <div className="max-w-xl mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-8 animate-slideUp">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-gray-900">Wakaf Berhasil! <PartyPopper className="inline-block w-6 h-6 text-amber-500 mb-1 ml-1" /></h1>
          <p className="text-gray-500 mt-2">Terima kasih atas kontribusi Anda. Berikut sertifikat digital Anda.</p>
        </div>

        {/* Certificate */}
        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <CertificateCard
            ref={certRef}
            transaction={transaction}
            userName={userData?.name || 'Wakif'}
          />
        </div>

        {/* Download Button */}
        <div className="mt-6 text-center space-y-3 animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <Button variant="primary" size="lg" onClick={handleDownload} loading={downloading}>
            <span className="flex items-center gap-2"><Download className="w-5 h-5" /> Download Sertifikat</span>
          </Button>
          <p className="text-xs text-gray-400">
            Sertifikat akan diunduh sebagai gambar PNG
          </p>
        </div>
      </div>
    </div>
  );
}
