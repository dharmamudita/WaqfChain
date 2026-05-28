'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const demoData = [
  { month: 'Jan', amount: 125000000 },
  { month: 'Feb', amount: 187000000 },
  { month: 'Mar', amount: 215000000 },
  { month: 'Apr', amount: 298000000 },
  { month: 'Mei', amount: 342000000 },
  { month: 'Jun', amount: 405000000 },
  { month: 'Jul', amount: 378000000 },
  { month: 'Aug', amount: 456000000 },
  { month: 'Sep', amount: 512000000 },
  { month: 'Okt', amount: 489000000 },
  { month: 'Nov', amount: 567000000 },
  { month: 'Des', amount: 623000000 },
];

interface TransparencyChartProps {
  data?: { month: string; amount: number }[];
}

export default function TransparencyChart({ data }: TransparencyChartProps) {
  const chartData = data || demoData;

  const formatAmount = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}M`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}Jt`;
    return value.toString();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold font-heading text-gray-900 mb-1">Pemasukan Per Bulan</h3>
      <p className="text-sm text-gray-500 mb-6">Total dana wakaf yang terkumpul setiap bulan</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tickFormatter={formatAmount} tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              formatter={(value: unknown) => [
                new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value as number),
                'Pemasukan',
              ]}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Line type="monotone" dataKey="amount" stroke="#0F6E56" strokeWidth={3} dot={{ fill: '#0F6E56', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#0F6E56' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
