'use client';

import { forwardRef } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import type { Transaction } from '@/types';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

interface CertificateCardProps {
  transaction: Transaction;
  userName: string;
}

const CertificateCard = forwardRef<HTMLDivElement, CertificateCardProps>(
  ({ transaction, userName }, ref) => {
    const date = transaction.createdAt?.toDate
      ? transaction.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
      <div ref={ref} className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-lg mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cert-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cert-pattern)" />
            </svg>
          </div>
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold font-heading">SERTIFIKAT WAKAF</h2>
            <p className="text-teal-200 text-sm mt-1">WaqfChain Digital Certificate</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Recipient */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Diberikan kepada</p>
            <p className="text-2xl font-bold text-gray-900 font-heading">{userName}</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <span className="text-amber-500">✦</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Proyek</span>
              <span className="text-sm font-semibold text-gray-900">{transaction.projectTitle}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Nominal</span>
              <span className="text-sm font-bold text-teal-700">{formatCurrency(transaction.amount)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Kontribusi</span>
              <span className="text-sm font-semibold text-amber-700">{transaction.percentage}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Tanggal</span>
              <span className="text-sm text-gray-700">{date}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">ID Transaksi</span>
              <span className="text-xs font-mono text-gray-400">{transaction.txId}</span>
            </div>
          </div>

          {/* Contribution message */}
          <div className="bg-gradient-to-r from-teal-50 to-amber-50 rounded-xl p-4 text-center border border-teal-100">
            <p className="text-sm text-gray-700">
              Anda memiliki <strong className="text-teal-700">{transaction.percentage}%</strong> kontribusi pada{' '}
              <strong>{transaction.projectTitle}</strong>
            </p>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <QRCodeDisplay value={`https://waqfchain.com/verify/${transaction.txId}`} size={100} />
            <p className="text-xs text-gray-400 mt-2">Scan untuk verifikasi</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} WaqfChain — Platform Wakaf Digital Transparan
          </p>
        </div>
      </div>
    );
  }
);

CertificateCard.displayName = 'CertificateCard';
export default CertificateCard;
