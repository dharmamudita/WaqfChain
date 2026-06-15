'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getUserTransactions } from '@/lib/firestore';
import Badge, { getStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { Transaction } from '@/types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function getRecommendation(income: number): { amount: number; label: string } {
  if (income < 2000000) return { amount: 10000, label: 'Rp10.000' };
  if (income < 5000000) return { amount: 25000, label: 'Rp25.000' };
  if (income < 10000000) return { amount: 50000, label: 'Rp50.000' };
  return { amount: 100000, label: 'Rp100.000' };
}

export default function AkunPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState('');
  const [showRec, setShowRec] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getUserTransactions(user.uid)
        .then(setTransactions)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user?.uid]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full" />
      </div>
    );
  }

  const successTx = transactions.filter((t) => t.status === 'success');
  const incomeNum = parseInt(income.replace(/\D/g, '')) || 0;
  const rec = getRecommendation(incomeNum);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Profile Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-4xl font-extrabold shadow-xl shadow-teal-900/50 border border-white/10">
                {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-3 text-xs font-medium text-teal-200">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Online
                </div>
                <h1 className="text-3xl font-extrabold font-heading mb-1">{userData?.name || 'Pengguna'}</h1>
                <p className="text-teal-200/80 font-medium">{userData?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <p className="text-sm text-teal-200/80 mb-1 font-medium">Total Wakaf</p>
                <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-100">{formatCurrency(userData?.totalWakaf || 0)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <p className="text-sm text-teal-200/80 mb-1 font-medium">Transaksi</p>
                <p className="text-2xl font-extrabold text-white">{transactions.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <p className="text-sm text-teal-200/80 mb-1 font-medium">Sertifikat</p>
                <p className="text-2xl font-extrabold text-white">{successTx.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Financial Recommendation */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <span className="text-9xl">🤖</span>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl">
                🤖
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-gray-900">Rekomendasi Wakaf Cerdas</h3>
                <p className="text-sm text-gray-500">Hitung nominal wakaf rutin sesuai penghasilan Anda</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                <input
                  type="text"
                  value={income ? new Intl.NumberFormat('id-ID').format(parseInt(income.replace(/\D/g, '') || '0')) : ''}
                  onChange={(e) => setIncome(e.target.value.replace(/\D/g, ''))}
                  placeholder="Masukkan penghasilan bulanan..."
                  className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all text-gray-900 font-medium"
                />
              </div>
              <Button variant="primary" onClick={() => setShowRec(true)} disabled={!income} className="!py-4 !px-8 !rounded-2xl !bg-gradient-to-r !from-gray-900 !to-gray-800 hover:!from-black hover:!to-gray-900 shadow-xl shadow-gray-900/20">
                ✨ Hitung
              </Button>
            </div>

            {showRec && incomeNum > 0 && (
              <div className="mt-6 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/50 shadow-inner animate-slideUp">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-xl flex-shrink-0">
                    💡
                  </div>
                  <div>
                    <p className="text-base text-gray-800 leading-relaxed mb-2">
                      Berdasarkan penghasilan <span className="font-bold text-gray-900">{formatCurrency(incomeNum)}</span>/bulan, 
                      kami merekomendasikan Anda untuk berwakaf rutin sebesar:
                    </p>
                    <div className="inline-block bg-white px-5 py-2.5 rounded-xl shadow-sm border border-amber-100 mb-3">
                      <span className="text-xl font-extrabold text-amber-600">{rec.label} <span className="text-sm text-gray-500 font-medium">/ minggu</span></span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-4">
                      Itu sekitar <span className="text-gray-700 font-bold">{formatCurrency(rec.amount * 4)}</span> per bulan (hanya <span className="text-amber-600 font-bold">{((rec.amount * 4 / incomeNum) * 100).toFixed(1)}%</span> dari penghasilan Anda).
                    </p>
                    <Link href="/marketplace">
                      <Button variant="primary" size="md" className="!bg-gradient-to-r !from-amber-500 !to-amber-600 hover:!from-amber-600 hover:!to-amber-700 !shadow-lg !shadow-amber-500/25">
                        Mulai Wakaf Sekarang →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden">
          <div className="p-7 border-b border-gray-100 flex items-center gap-3 bg-gray-50/30">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-bold font-heading text-gray-900 text-lg">Riwayat Transaksi</h3>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full mx-auto" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-16 text-center bg-gray-50/50 m-6 rounded-2xl border border-dashed border-gray-200">
              <div className="text-5xl mb-4 opacity-50">📜</div>
              <h4 className="text-gray-900 font-bold mb-1">Belum Ada Transaksi</h4>
              <p className="text-gray-500 text-sm mb-5">Anda belum pernah melakukan donasi wakaf.</p>
              <Link href="/marketplace">
                <Button variant="primary" size="md" className="!rounded-xl">Jelajahi Proyek Wakaf</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx, idx) => {
                const sb = getStatusBadge(tx.status);
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-teal-50/30 transition-colors gap-4">
                    <div className="flex-1 min-w-0 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                        {tx.status === 'success' ? '✅' : tx.status === 'pending' ? '⏳' : '❌'}
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900 truncate">{tx.projectTitle}</p>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">ID: {tx.orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-right">
                        <p className="text-base font-extrabold text-teal-700">{formatCurrency(tx.amount)}</p>
                        <p className="text-xs text-gray-400 font-medium">{tx.percentage}% dari target</p>
                      </div>
                      <Badge variant={sb.variant} className="shadow-sm">{sb.label}</Badge>
                      {tx.status === 'success' && (
                        <Link href={`/akun/token/${tx.txId}`}>
                          <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95" title="Lihat Sertifikat">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Sertifikat
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
