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
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                icon: '🔍',
              },
              {
                step: '02',
                title: 'Tentukan Nominal',
                desc: 'Mulai dari Rp10.000, tentukan nominal wakaf sesuai kemampuan Anda.',
                icon: '💰',
              },
              {
                step: '03',
                title: 'Dapatkan Sertifikat',
                desc: 'Terima sertifikat digital dengan QR code sebagai bukti wakaf Anda.',
                icon: '📜',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-center group hover:-translate-y-1">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
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
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 rounded-3xl overflow-hidden p-8 md:p-16 text-center text-white">
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
