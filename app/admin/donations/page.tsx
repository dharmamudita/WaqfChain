'use client';

import { useState, useEffect } from 'react';
import { getPendingManualTransactions, approveManualTransaction, rejectManualTransaction } from '@/lib/firestore';
import type { Transaction } from '@/types';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Image as ImageIcon, Eye } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function AdminDonationsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Image Modal State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const data = await getPendingManualTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleApprove = async (txId: string) => {
    if (!window.confirm('Apakah Anda yakin donasi ini valid dan dana sudah masuk?')) return;
    
    setProcessingId(txId);
    try {
      await approveManualTransaction(txId);
      toast.success('Donasi berhasil diverifikasi!');
      await fetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat memverifikasi donasi');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (txId: string) => {
    if (!window.confirm('Tolak donasi ini? Data tidak akan ditambahkan ke total wakaf.')) return;
    
    setProcessingId(txId);
    try {
      await rejectManualTransaction(txId);
      toast.success('Donasi ditolak');
      await fetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat menolak donasi');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Verifikasi Donasi Manual</h1>
      
      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Semua Selesai!</h3>
          <p className="text-gray-500">Tidak ada donasi manual yang menunggu verifikasi saat ini.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                  <th className="p-4 font-semibold text-gray-700">Tanggal</th>
                  <th className="p-4 font-semibold text-gray-700">Nama Donatur</th>
                  <th className="p-4 font-semibold text-gray-700">Proyek</th>
                  <th className="p-4 font-semibold text-gray-700">Nominal</th>
                  <th className="p-4 font-semibold text-gray-700">Bukti Transfer</th>
                  <th className="p-4 font-semibold text-gray-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.txId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500">
                      {tx.createdAt.toDate().toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{tx.donorName || 'Hamba Allah'}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-700 truncate max-w-[200px]" title={tx.projectTitle}>
                        {tx.projectTitle}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-teal-700">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(tx.amount)}
                      </p>
                    </td>
                    <td className="p-4">
                      {tx.manualReceiptUrl ? (
                        <button 
                          onClick={() => setSelectedImage(tx.manualReceiptUrl!)}
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" /> Lihat Resi
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Tidak ada</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleReject(tx.txId)}
                        disabled={processingId === tx.txId}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Tolak Donasi"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleApprove(tx.txId)}
                        disabled={processingId === tx.txId}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition disabled:opacity-50"
                        title="Verifikasi Donasi"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="Bukti Transfer" size="md">
        <div className="flex justify-center p-2">
          {selectedImage && (
            <img src={selectedImage} alt="Bukti Transfer" className="max-w-full h-auto rounded-xl max-h-[70vh] object-contain" />
          )}
        </div>
        <div className="p-4 flex justify-end">
          <Button variant="outline" onClick={() => setSelectedImage(null)}>Tutup</Button>
        </div>
      </Modal>
    </div>
  );
}
