'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects, getAllTransactions, getAllChats, deleteProject } from '@/lib/firestore';
import Badge, { getStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { Project, Transaction, Chat } from '@/types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getAllTransactions(), getAllChats()])
      .then(([p, t, c]) => {
        setProjects(p);
        setTransactions(t);
        setChats(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success('Proyek berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus proyek');
    }
  };

  const totalDana = transactions.filter((t) => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const activeProjects = projects.filter((p) => p.status === 'aktif').length;
  const unreadChats = chats.filter((c) => !c.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-heading text-gray-900">Dashboard Admin</h1>
        <p className="text-sm text-gray-500">Kelola proyek, transaksi, dan chat WaqfChain</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 rounded-xl">
              <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Dana</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalDana)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Proyek Aktif</p>
              <p className="text-lg font-bold text-gray-900">{activeProjects}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Transaksi</p>
              <p className="text-lg font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Pesan Masuk</p>
              <p className="text-lg font-bold text-gray-900">{unreadChats}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold font-heading text-gray-900">Daftar Proyek</h3>
          <Link href="/admin/proyek/tambah">
            <Button variant="primary" size="sm">+ Tambah Proyek</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Proyek</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tipe</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Terkumpul</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((p) => {
                const sb = getStatusBadge(p.status);
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{p.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{p.type}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{formatCurrency(p.collectedAmount)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-full max-w-[100px] mx-auto">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${p.progressPercent}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{p.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center"><Badge variant={sb.variant}>{sb.label}</Badge></td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/proyek/${p.id}/edit`}>
                          <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </Link>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {projects.length === 0 && !loading && (
            <p className="text-center py-12 text-gray-400">Belum ada proyek</p>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold font-heading text-gray-900">Riwayat Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Proyek</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Jumlah</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.slice(0, 20).map((t, idx) => {
                const sb = getStatusBadge(t.status);
                return (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{t.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t.projectTitle}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{formatCurrency(t.amount)}</td>
                    <td className="px-6 py-4 text-center"><Badge variant={sb.variant}>{sb.label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <p className="text-center py-12 text-gray-400">Belum ada transaksi</p>
          )}
        </div>
      </div>
    </div>
  );
}
