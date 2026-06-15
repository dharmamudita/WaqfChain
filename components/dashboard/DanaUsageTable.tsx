'use client';

import type { DanaUsage } from '@/types';


interface DanaUsageTableProps {
  data?: DanaUsage[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function DanaUsageTable({ data }: DanaUsageTableProps) {
  const tableData = data || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold font-heading text-gray-900">Riwayat Penggunaan Dana</h3>
        <p className="text-sm text-gray-500 mt-1">Detail pengeluaran dana wakaf yang tercatat</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tipe</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Keterangan</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Jumlah</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Bukti</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tableData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.date?.toDate ? item.date.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </td>
                <td className="px-6 py-4">
                  {item.usageType === 'penyerahan' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                      Penyerahan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      Penggunaan
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{item.description}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                <td className="px-6 py-4 text-center">
                  {item.receiptUrl ? (
                    <button
                      onClick={() => window.open(item.receiptUrl, '_blank')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Lihat
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
