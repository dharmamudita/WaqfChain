'use client';

import { useState } from 'react';
import { createDanaUsage, uploadImage } from '@/lib/firestore';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { Project, DanaUsage, DanaUsageType } from '@/types';

interface DanaUsageModalProps {
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (usage: DanaUsage) => void;
}

const CATEGORIES = ['Pembelian Material', 'Tenaga Kerja', 'Biaya Pendidikan', 'Operasional', 'Lainnya'];

export default function DanaUsageModal({ projects, isOpen, onClose, onSuccess }: DanaUsageModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    category: CATEGORIES[0],
    amount: '',
    description: '',
    usageType: 'penggunaan' as DanaUsageType,
  });
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId || !formData.amount || !formData.description) {
      toast.error('Mohon isi semua data yang wajib');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Menyimpan data pengeluaran...');

    try {
      let receiptUrl = '';
      if (file) {
        receiptUrl = await uploadImage(file, 'receipts');
      }

      const newUsage: Omit<DanaUsage, 'id' | 'createdAt' | 'date'> = {
        projectId: formData.projectId,
        category: formData.category,
        amount: Number(formData.amount),
        description: formData.description,
        receiptUrl,
        usageType: formData.usageType,
      };

      const id = await createDanaUsage(newUsage);
      
      toast.success('Data pengeluaran berhasil dicatat', { id: toastId });
      onSuccess({ ...newUsage, id, date: { toDate: () => new Date() } as any } as DanaUsage);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan data', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Tambah Pengeluaran</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Proyek <span className="text-red-500">*</span></label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            >
              <option value="" disabled>Pilih proyek...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Laporan <span className="text-red-500">*</span></label>
            <div className="flex gap-3">
              <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                formData.usageType === 'penggunaan' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
                <input type="radio" name="usageType" value="penggunaan" checked={formData.usageType === 'penggunaan'} onChange={() => setFormData({ ...formData, usageType: 'penggunaan' })} className="sr-only" />
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="text-sm font-medium">Penggunaan</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                formData.usageType === 'penyerahan' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
                <input type="radio" name="usageType" value="penyerahan" checked={formData.usageType === 'penyerahan'} onChange={() => setFormData({ ...formData, usageType: 'penyerahan' })} className="sr-only" />
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                <span className="text-sm font-medium">Penyerahan</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp) <span className="text-red-500">*</span></label>
            <input
              type="number"
              required
              min="0"
              placeholder="Contoh: 5000000"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Deskripsi <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={3}
              placeholder="Contoh: Pembelian semen dan bata"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Nota/Kuitansi (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            <Button type="submit" variant="primary" loading={loading}>Simpan Pengeluaran</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
