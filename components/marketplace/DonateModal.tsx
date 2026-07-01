'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Heart, Hourglass, AlertTriangle, QrCode } from 'lucide-react';
import type { Project } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { Copy } from 'lucide-react';

const presetAmounts = [
  { value: 10000, label: 'Rp10.000' },
  { value: 25000, label: 'Rp25.000' },
  { value: 50000, label: 'Rp50.000' },
  { value: 100000, label: 'Rp100.000' },
  { value: 250000, label: 'Rp250.000' },
  { value: 500000, label: 'Rp500.000' },
];

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function DonateModal({ isOpen, onClose, project }: DonateModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const selectedAmount = customAmount ? parseInt(customAmount) : amount;

  const handlePresetClick = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomChange = (value: string) => {
    const num = value.replace(/\D/g, '');
    setCustomAmount(num);
    setAmount(0);
  };

  const formatInputCurrency = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(value));
  };

  const handleDonate = async () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    if (selectedAmount < 10000) {
      toast.error('Minimal wakaf Rp10.000');
      return;
    }

    // Bypass Midtrans connection to show Dummy QR
    setShowQR(true);

    /* --- MIDTRANS API CONNECTION (DISABLED TEMPORARILY) ---
    setLoading(true);
    try {
      const res = await fetch('/api/midtrans/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          projectId: project.id,
          amount: selectedAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Gagal membuat transaksi');

      // Open Midtrans Snap
      if (window.snap) {
        window.snap.pay(data.snapToken, {
          onSuccess: () => {
            toast.success('Wakaf berhasil! Terima kasih.');
            onClose();
            router.push(`/akun/token/${data.txId}`);
          },
          onPending: () => {
            toast('Pembayaran menunggu konfirmasi', { icon: <Hourglass className="w-4 h-4 text-amber-500" /> });
            onClose();
          },
          onError: () => {
            toast.error('Pembayaran gagal');
          },
          onClose: () => {
            toast('Pembayaran dibatalkan', { icon: <AlertTriangle className="w-4 h-4 text-red-500" /> });
          },
        });
      } else {
        toast.error('Payment gateway belum siap, coba lagi.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      toast.error(message);
    } finally {
      setLoading(false);
    }
    ------------------------------------------------------ */
  };

  const remaining = project.targetAmount - project.collectedAmount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer Pembayaran" size="md">
      <div className="flex flex-col items-center justify-center space-y-6 pb-4 px-2">
        <div className="text-center">
          <h4 className="font-bold text-gray-900 mb-1">Wakaf untuk {project.title}</h4>
          <p className="text-sm text-gray-500">Silakan transfer seikhlasnya ke salah satu rekening berikut</p>
        </div>
        
        <div className="w-full space-y-4">
          {/* SeaBank */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 font-bold mb-1 uppercase tracking-wider">SeaBank</p>
              <p className="text-xl font-bold text-gray-900 font-heading tracking-wide">9012 3456 7890</p>
              <p className="text-sm text-gray-500 mt-1">a/n WaqfChain (Silakan ubah no ini)</p>
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText('901234567890'); toast.success('Nomor rekening SeaBank disalin'); }}
              className="p-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors"
              title="Salin Nomor"
            >
              <Copy className="w-6 h-6" />
            </button>
          </div>

          {/* DANA */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">DANA / E-Wallet</p>
              <p className="text-xl font-bold text-gray-900 font-heading tracking-wide">0812 3456 7890</p>
              <p className="text-sm text-gray-500 mt-1">a/n WaqfChain (Silakan ubah no ini)</p>
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText('081234567890'); toast.success('Nomor DANA disalin'); }}
              className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              title="Salin Nomor"
            >
              <Copy className="w-6 h-6" />
            </button>
          </div>
        </div>

        <Button 
          variant="primary" 
          size="lg"
          fullWidth 
          onClick={() => {
            toast.success('Terima kasih! Pembayaran Anda akan diverifikasi admin.');
            onClose();
          }}
          className="shadow-lg mt-4"
        >
          Selesai Transfer
        </Button>
        
        <p className="text-xs text-gray-400 text-center leading-relaxed max-w-sm mt-2">
          *Untuk sementara pembayaran dilakukan secara manual melalui transfer langsung tanpa batasan nominal.
        </p>
      </div>

      {/* --- FORM MIDTRANS & NOMINAL (DINONAKTIFKAN SEMENTARA) ---
      <div className="space-y-6 hidden">
        ... (kode form lama tersimpan di sini)
      </div>
      ---------------------------------------------------------- */}
    </Modal>
  );
}
