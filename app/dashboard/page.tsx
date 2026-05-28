'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import TransparencyChart from '@/components/dashboard/TransparencyChart';
import DanaUsageTable from '@/components/dashboard/DanaUsageTable';
import MediaGallery from '@/components/dashboard/MediaGallery';

const pieData = [
  { name: 'Pembelian Material', value: 35, color: '#0F6E56' },
  { name: 'Tenaga Kerja', value: 25, color: '#2dd4bf' },
  { name: 'Biaya Pendidikan', value: 20, color: '#854F0B' },
  { name: 'Operasional', value: 12, color: '#fbbf24' },
  { name: 'Lainnya', value: 8, color: '#93c5fd' },
];

export default function DashboardPage() {
  const [selectedProject, setSelectedProject] = useState('');

  const projects = [
    { id: '', label: 'Semua Proyek' },
    { id: '1', label: 'Kebun Produktif Cianjur' },
    { id: '2', label: 'Sumur Bor NTT' },
    { id: '3', label: 'Beasiswa Anak Yatim' },
  ];

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
              {p.label}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Pemasukan</p>
            <p className="text-2xl font-extrabold font-heading text-teal-700">Rp4,6M</p>
            <p className="text-xs text-emerald-500 mt-1">↑ 12% dari bulan lalu</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Pengeluaran</p>
            <p className="text-2xl font-extrabold font-heading text-amber-700">Rp3,2M</p>
            <p className="text-xs text-gray-400 mt-1">69.5% dari pemasukan</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Saldo Tersisa</p>
            <p className="text-2xl font-extrabold font-heading text-gray-900">Rp1,4M</p>
            <p className="text-xs text-gray-400 mt-1">Siap disalurkan</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransparencyChart />
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
          </div>
        </div>

        {/* Dana Usage Table */}
        <DanaUsageTable />

        {/* Media Gallery */}
        <MediaGallery mediaUrls={[]} />
      </div>
    </div>
  );
}
