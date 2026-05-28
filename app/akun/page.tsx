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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl font-bold">
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold font-heading">{userData?.name || 'Pengguna'}</h1>
              <p className="text-teal-200">{userData?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-teal-200">Total Wakaf</p>
              <p className="text-xl font-bold">{formatCurrency(userData?.totalWakaf || 0)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-teal-200">Transaksi</p>
              <p className="text-xl font-bold">{transactions.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-teal-200">Sertifikat</p>
              <p className="text-xl font-bold">{successTx.length}</p>
            </div>
          </div>
        </div>

        {/* AI Financial Recommendation */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-lg font-bold font-heading text-gray-900">Rekomendasi Wakaf Cerdas</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Masukkan penghasilan bulanan Anda untuk mendapatkan rekomendasi wakaf rutin yang sesuai.
          </p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">Rp</span>
              <input
                type="text"
                value={income ? new Intl.NumberFormat('id-ID').format(parseInt(income.replace(/\D/g, '') || '0')) : ''}
                onChange={(e) => setIncome(e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
              />
            </div>
            <Button variant="primary" onClick={() => setShowRec(true)} disabled={!income}>
              Hitung
            </Button>
          </div>

          {showRec && incomeNum > 0 && (
            <div className="mt-4 bg-gradient-to-r from-teal-50 to-amber-50 rounded-xl p-5 border border-teal-100 animate-slideUp">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Dengan penghasilan <strong>{formatCurrency(incomeNum)}</strong>/bulan,
                    rekomendasi wakaf rutin Anda adalah{' '}
                    <strong className="text-teal-700">{rec.label}/minggu</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ≈ {formatCurrency(rec.amount * 4)}/bulan ({((rec.amount * 4 / incomeNum) * 100).toFixed(1)}% dari penghasilan)
                  </p>
                  <Link href="/marketplace" className="inline-block mt-3">
                    <Button variant="primary" size="sm">Wakaf Sekarang →</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold font-heading text-gray-900">Riwayat Transaksi</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full mx-auto" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📜</div>
              <p className="text-gray-500">Belum ada transaksi</p>
              <Link href="/marketplace" className="inline-block mt-3">
                <Button variant="outline" size="sm">Mulai Wakaf →</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx, idx) => {
                const sb = getStatusBadge(tx.status);
                return (
                  <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{tx.projectTitle}</p>
                      <p className="text-xs text-gray-400">{tx.orderId}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(tx.amount)}</p>
                        <p className="text-xs text-gray-400">{tx.percentage}%</p>
                      </div>
                      <Badge variant={sb.variant}>{sb.label}</Badge>
                      {tx.status === 'success' && (
                        <Link href={`/akun/token/${tx.txId}`}>
                          <button className="p-1.5 hover:bg-teal-50 rounded-lg text-teal-600 transition-colors" title="Lihat Sertifikat">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
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
