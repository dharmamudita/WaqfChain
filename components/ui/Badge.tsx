interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'teal' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'neutral', size = 'sm', className = '' }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-gray-50 text-gray-600 border-gray-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}

// Helper to map status to badge variant
export function getStatusBadge(status: string) {
  const map: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    aktif: { variant: 'success', label: 'Aktif' },
    selesai: { variant: 'info', label: 'Selesai' },
    ditangguhkan: { variant: 'warning', label: 'Ditangguhkan' },
    pending: { variant: 'warning', label: 'Menunggu' },
    success: { variant: 'success', label: 'Berhasil' },
    failed: { variant: 'danger', label: 'Gagal' },
  };

  return map[status] || { variant: 'neutral' as const, label: status };
}
