'use client';

import { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import TransparencyChart from '@/components/dashboard/TransparencyChart';
import DanaUsageTable from '@/components/dashboard/DanaUsageTable';
import MediaGallery from '@/components/dashboard/MediaGallery';
import { getProjects, getAllTransactions, getDanaUsages } from '@/lib/firestore';
import type { Project, Transaction, DanaUsage } from '@/types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const CATEGORY_COLORS: Record<string, string> = {
  'Pembelian Material': '#0F6E56',
  'Tenaga Kerja': '#2dd4bf',
  'Biaya Pendidikan': '#854F0B',
  'Operasional': '#fbbf24',
  'Lainnya': '#93c5fd',
};

export default function DashboardPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [danaUsages, setDanaUsages] = useState<DanaUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getAllTransactions(), getDanaUsages()])
      .then(([p, t, d]) => {
        setProjects(p);
        setTransactions(t);
        setDanaUsages(d);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter data based on selected project
  const filteredTransactions = useMemo(() => {
    let txs = transactions.filter(t => t.status === 'success');
    if (selectedProject) {
      txs = txs.filter(t => t.projectId === selectedProject);
    }
    return txs;
  }, [transactions, selectedProject]);

  const filteredUsages = useMemo(() => {
    let usages = danaUsages;
    if (selectedProject) {
      usages = usages.filter(u => u.projectId === selectedProject);
    }
    return usages;
  }, [danaUsages, selectedProject]);

  // Calculate stats
  const totalPemasukan = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPengeluaran = filteredUsages.reduce((sum, u) => sum + u.amount, 0);
  const saldoTersisa = totalPemasukan - totalPengeluaran;
  const persentasePengeluaran = totalPemasukan > 0 ? ((totalPengeluaran / totalPemasukan) * 100).toFixed(1) : '0';

  // Calculate Pie Chart Data
  const pieData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    filteredUsages.forEach(u => {
      categoryTotals[u.category] = (categoryTotals[u.category] || 0) + u.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: totalPengeluaran > 0 ? Number(((value / totalPengeluaran) * 100).toFixed(1)) : 0,
      amount: value,
      color: CATEGORY_COLORS[name] || '#9ca3af',
    })).sort((a, b) => b.value - a.value);
  }, [filteredUsages, totalPengeluaran]);

  // Calculate Line Chart Data (Monthly Income)
  const lineChartData = useMemo(() => {
    const monthlyTotals: Record<string, number> = {};
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toLocaleDateString('id-ID', { month: 'short' });
      monthlyTotals[monthStr] = 0;
    }

    filteredTransactions.forEach(t => {
      if (t.createdAt?.toDate) {
        const d = t.createdAt.toDate();
        const monthStr = d.toLocaleDateString('id-ID', { month: 'short' });
        if (monthlyTotals[monthStr] !== undefined) {
          monthlyTotals[monthStr] += t.amount;
        }
      }
    });

    return Object.entries(monthlyTotals).map(([month, amount]) => ({ month, amount }));
  }, [filteredTransactions]);

  // Get Media Gallery from receipt URLs
  const mediaUrls = useMemo(() => {
    return filteredUsages.filter(u => u.receiptUrl).map(u => u.receiptUrl);
  }, [filteredUsages]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50/30 flex items-center justify-center text-teal-600 font-semibold animate-pulse">Memuat Data Transparansi...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 text-xs font-medium text-teal-200">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Laporan Real-Time
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading mb-4">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Transparansi</span>
          </h1>
          <p className="text-teal-200/80 text-lg max-w-2xl leading-relaxed">
            Pantau penggunaan dana wakaf secara real-time. Setiap rupiah tercatat dan dapat dipertanggungjawabkan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Summary Cards - floating overlap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 -mt-16 relative z-10">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-premium group hover:shadow-premium-hover transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Total Pemasukan</p>
                <p className="text-2xl font-extrabold font-heading text-gray-900">{formatCurrency(totalPemasukan)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-premium group hover:shadow-premium-hover transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Total Pengeluaran</p>
                <p className="text-2xl font-extrabold font-heading text-amber-700">{formatCurrency(totalPengeluaran)}</p>
                <p className="text-xs text-gray-400">{persentasePengeluaran}% dari pemasukan</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-premium group hover:shadow-premium-hover transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Saldo Tersisa</p>
                <p className="text-2xl font-extrabold font-heading text-gray-900">{formatCurrency(saldoTersisa)}</p>
                <p className="text-xs text-gray-400">Siap disalurkan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filter Proyek</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedProject('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedProject === ''
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-500/25'
                  : 'bg-gray-50 text-gray-600 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              Semua Proyek
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedProject === p.id
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-500/25'
                    : 'bg-gray-50 text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransparencyChart data={lineChartData} />
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-premium">
            <h3 className="text-lg font-bold font-heading text-gray-900 mb-1">Distribusi Penggunaan</h3>
            <p className="text-sm text-gray-500 mb-4">Per kategori pengeluaran</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: unknown) => [`${value}%`, '']} contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {pieData.length > 0 ? (
              <div className="space-y-2.5 mt-4">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-400 mt-8">Belum ada pengeluaran</p>
            )}
          </div>
        </div>

        {/* Dana Usage Table */}
        <DanaUsageTable data={filteredUsages} />

        {/* Media Gallery */}
        <MediaGallery mediaUrls={mediaUrls} />
      </div>
    </div>
  );
}
