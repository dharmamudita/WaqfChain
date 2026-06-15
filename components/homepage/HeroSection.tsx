'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStats } from '@/lib/firestore';
import Button from '@/components/ui/Button';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function HeroSection() {
  const [stats, setStats] = useState({ totalCollected: 0, totalProjects: 0, totalDonors: 0 });

  useEffect(() => {
    getStats().then(setStats).catch(() => {
      // Use fallback demo data
      setStats({ totalCollected: 2847500000, totalProjects: 24, totalDonors: 1847 });
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-400/5 rounded-full blur-3xl" />
        {/* Geometric pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 animate-slideDown">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-teal-100">Platform Wakaf Digital Transparan</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading leading-tight mb-6 animate-slideUp">
            Berwakaf Mudah,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              Transparan
            </span>
            ,{' '}
            <br className="hidden sm:block" />
            dan Berdampak
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.1s' }}>
            WaqfChain menghubungkan Anda dengan proyek wakaf produktif di seluruh Indonesia.
            Setiap kontribusi tercatat transparan dan berdampak nyata.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <Link href="/marketplace">
              <Button size="lg" className="!bg-gradient-to-r !from-amber-400 !to-amber-500 !text-amber-900 !shadow-amber-500/30 hover:!shadow-amber-500/50 !font-bold">
                Mulai Wakaf dari Rp10.000
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                Lihat Transparansi
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="glass-dark rounded-3xl p-6 text-center shadow-xl shadow-black/10">
              <p className="text-2xl md:text-3xl font-bold font-heading text-white mb-1">
                {formatCurrency(stats.totalCollected)}
              </p>
              <p className="text-sm text-teal-200/80">Total Dana Terkumpul</p>
            </div>
            <div className="glass-dark rounded-3xl p-6 text-center shadow-xl shadow-black/10">
              <p className="text-2xl md:text-3xl font-bold font-heading text-white mb-1">
                {stats.totalProjects}+
              </p>
              <p className="text-sm text-teal-200/80">Proyek Aktif</p>
            </div>
            <div className="glass-dark rounded-3xl p-6 text-center shadow-xl shadow-black/10">
              <p className="text-2xl md:text-3xl font-bold font-heading text-white mb-1">
                {stats.totalDonors.toLocaleString('id-ID')}+
              </p>
              <p className="text-sm text-teal-200/80">Wakif Terdaftar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
