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
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading mb-3">
            Dashboard Transparansi
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl">
            Pantau penggunaan dana wakaf secara real-time. Setiap rupiah tercatat dan dapat dipertanggungjawabkan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedProject('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedProject === ''
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300'
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
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Pemasukan</p>
            <p className="text-2xl font-extrabold font-heading text-teal-700">{formatCurrency(totalPemasukan)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Pengeluaran</p>
            <p className="text-2xl font-extrabold font-heading text-amber-700">{formatCurrency(totalPengeluaran)}</p>
            <p className="text-xs text-gray-400 mt-1">{persentasePengeluaran}% dari pemasukan</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Saldo Tersisa</p>
            <p className="text-2xl font-extrabold font-heading text-gray-900">{formatCurrency(saldoTersisa)}</p>
            <p className="text-xs text-gray-400 mt-1">Siap disalurkan</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransparencyChart data={lineChartData} />
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
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
                  <Tooltip formatter={(value: unknown) => [`${value}%`, '']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {pieData.length > 0 ? (
              <div className="space-y-2 mt-4">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.value}%</span>
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
