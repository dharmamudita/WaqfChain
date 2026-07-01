'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/homepage/HeroSection';
import StatsSection from '@/components/homepage/StatsSection';
import ProjectCard from '@/components/homepage/ProjectCard';
import Button from '@/components/ui/Button';
import { getProjects } from '@/lib/firestore';
import type { Project } from '@/types';
import { Timestamp } from 'firebase/firestore';
import { Search, Coins, FileText } from 'lucide-react';


export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects({ status: 'aktif', limitCount: 3 })
      .then((data) => {
        setProjects(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSection />
      <StatsSection />

      {/* Featured Projects */}
      <section className="py-20 md:py-28 relative bg-gray-50/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-3">
                Proyek <span className="gradient-text">Unggulan</span>
              </h2>
              <p className="text-gray-600">
                Proyek wakaf terbaru yang membutuhkan dukungan Anda.
              </p>
            </div>
            <Link href="/marketplace" className="hidden md:block">
              <Button variant="outline" size="sm">
                Lihat Semua →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/marketplace">
              <Button variant="outline">Lihat Semua Proyek →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-white to-teal-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Cara Kerja <span className="gradient-text">WaqfChain</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berwakaf semudah 3 langkah. Pilih proyek, tentukan nominal, dan dapatkan sertifikat digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Pilih Proyek',
                desc: 'Telusuri proyek wakaf yang sesuai dengan minat Anda di marketplace kami.',
                icon: <Search className="w-12 h-12" />,
              },
              {
                step: '02',
                title: 'Tentukan Nominal',
                desc: 'Mulai dari Rp10.000, tentukan nominal wakaf sesuai kemampuan Anda.',
                icon: <Coins className="w-12 h-12" />,
              },
              {
                step: '03',
                title: 'Dapatkan Sertifikat',
                desc: 'Terima sertifikat digital dengan QR code sebagai bukti wakaf Anda.',
                icon: <FileText className="w-12 h-12" />,
              },
            ].map((item, idx) => (
              <div key={idx} className="relative glass rounded-3xl p-8 shadow-premium hover:shadow-premium-hover transition-all duration-500 text-center group">
                <div className="mb-6 flex justify-center text-teal-500 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl rotate-12 flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:rotate-0 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative bg-gradient-to-br from-teal-800 via-teal-900 to-teal-950 rounded-[2.5rem] overflow-hidden p-10 md:p-20 text-center text-white shadow-2xl">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-4">
                Siap Menjadi Bagian dari Perubahan?
              </h2>
              <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan wakif yang telah memberikan dampak nyata melalui WaqfChain.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="!bg-white !text-teal-800 hover:!bg-gray-100 !font-bold">
                    Daftar Sekarang — Gratis
                  </Button>
                </Link>
                <Link href="/edukasi">
                  <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
