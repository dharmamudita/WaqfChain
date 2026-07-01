'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Heart, Hourglass, AlertTriangle, QrCode, Trophy, HeartHandshake, Sparkles } from 'lucide-react';
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
    <Modal isOpen={isOpen} onClose={onClose} title="Dukung Tim WaqfChain" size="md">
      <div className="flex flex-col items-center justify-center space-y-5 pb-2 px-1">
        
        {/* Header Section */}
        <div className="text-center">
          <h4 className="font-extrabold text-amber-500 mb-1.5 text-xl flex items-center justify-center gap-2">
            Bantu Kami Juara! <Trophy className="w-5 h-5" />
          </h4>
          <p className="text-sm text-gray-500 px-2 leading-relaxed">
            Dukungan seikhlasnya dari Anda sangat berarti untuk memacu semangat tim kami.
          </p>
        </div>
        
        {/* QR Code Container */}
        <div className="w-full flex flex-col items-center justify-center">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 w-full max-w-[240px]">
            <img src="/qris-payment.jpeg" alt="QRIS Payment" className="w-full h-auto rounded-xl object-contain border border-gray-50" />
            
            <div className="flex items-center justify-center gap-2 text-teal-700 font-bold text-sm bg-teal-50 px-4 py-2 rounded-xl w-full border border-teal-100">
              <QrCode className="w-4 h-4" /> Scan untuk Dukung
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 w-full max-w-[280px] text-center">
          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
            Bisa di-scan dari aplikasi m-Banking atau E-Wallet apa saja. Berapapun nominalnya, kami sangat berterima kasih! <HeartHandshake className="w-3 h-3 inline-block text-amber-600 ml-0.5 mb-0.5" />
          </p>
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
      <div className="space-y-6">
        <div className="bg-teal-50 rounded-xl p-4">
          <h4 className="font-semibold text-teal-800 font-heading text-sm">{project.title}</h4>
          <p className="text-xs text-teal-600 mt-1">
            Sisa target: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(remaining)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Nominal</label>
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  amount === preset.value && !customAmount
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25 scale-[1.02]'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Atau masukkan nominal lain</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">Rp</span>
            <input
              type="text"
              value={customAmount ? formatInputCurrency(customAmount) : ''}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="0"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-lg font-semibold transition-all"
            />
          </div>
          {customAmount && parseInt(customAmount) < 10000 && (
            <p className="text-xs text-red-500 mt-1">Minimal wakaf Rp10.000</p>
          )}
        </div>

        {selectedAmount >= 10000 && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-800">Total Wakaf</span>
              <span className="text-xl font-bold text-amber-900 font-heading">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(selectedAmount)}
              </span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              ≈ {((selectedAmount / project.targetAmount) * 100).toFixed(2)}% kontribusi dari target
            </p>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={selectedAmount < 10000}
          onClick={handleDonate}
        >
          {loading ? 'Memproses...' : <><Heart className="w-5 h-5 fill-current" /> Wakaf Sekarang</>}
        </Button>

        <p className="text-center text-xs text-gray-400">
          Pembayaran diproses secara aman melalui Midtrans
        </p>
      </div>
      ---------------------------------------------------------- */}
    </Modal>
  );
}
