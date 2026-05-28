'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/firestore';
import Badge from '@/components/ui/Badge';
import type { Project } from '@/types';
import { Timestamp } from 'firebase/firestore';

const demoProjects: Project[] = [
  { id: '1', title: 'Wakaf Kebun Produktif Cianjur', description: 'Kebun produktif 2 hektar', type: 'kebun', targetAmount: 500000000, collectedAmount: 325000000, progressPercent: 65, mediaUrls: [], location: { lat: -6.8, lng: 107.1, address: 'Cianjur, Jawa Barat' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { id: '2', title: 'Sumur Bor Desa Terpencil NTT', description: 'Sumur bor untuk 5 desa', type: 'sumur', targetAmount: 250000000, collectedAmount: 187500000, progressPercent: 75, mediaUrls: [], location: { lat: -10.1, lng: 123.6, address: 'Kupang, NTT' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { id: '3', title: 'Beasiswa Pendidikan Anak Yatim', description: 'Beasiswa 100 anak', type: 'pendidikan', targetAmount: 1000000000, collectedAmount: 420000000, progressPercent: 42, mediaUrls: [], location: { lat: -6.2, lng: 106.8, address: 'Jakarta' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { id: '4', title: 'Wakaf UMKM Batik Pekalongan', description: 'Modal usaha batik', type: 'umkm', targetAmount: 300000000, collectedAmount: 120000000, progressPercent: 40, mediaUrls: [], location: { lat: -6.89, lng: 109.67, address: 'Pekalongan, Jawa Tengah' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { id: '5', title: 'Pembangunan Masjid Desa Sulawesi', description: 'Masjid permanen', type: 'properti', targetAmount: 750000000, collectedAmount: 450000000, progressPercent: 60, mediaUrls: [], location: { lat: -1.43, lng: 121.45, address: 'Palu, Sulawesi Tengah' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
];

const typeIcons: Record<string, string> = {
  kebun: '🌱', umkm: '🏪', sumur: '💧', pendidikan: '📚', properti: '🏠',
};

function formatCurrency(amount: number) {
  if (amount >= 1000000000) return `Rp${(amount / 1000000000).toFixed(1)}M`;
  if (amount >= 1000000) return `Rp${(amount / 1000000).toFixed(0)}Jt`;
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export default function PetaPage() {
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjects({ status: 'aktif' })
      .then((data) => {
        if (data.length > 0) setProjects(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading mb-3">
            Peta Proyek Wakaf
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl">
            Lihat lokasi proyek wakaf WaqfChain yang tersebar di seluruh Indonesia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm" style={{ height: '600px' }}>
              {/* Static Map Placeholder - replace with Google Maps when API key is available */}
              <div className="w-full h-full relative bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
                {/* Indonesia Map SVG Simplified */}
                <svg viewBox="0 0 800 400" className="w-full h-full p-8 opacity-20">
                  <path d="M200,150 Q250,120 300,140 Q350,160 400,150 Q450,130 500,160 Q550,140 600,150 L600,200 Q550,190 500,210 Q450,220 400,200 Q350,210 300,190 Q250,180 200,200 Z" fill="#0F6E56" />
                  <path d="M100,200 Q150,180 200,200 Q220,210 200,230 Q180,240 150,230 Q120,220 100,200Z" fill="#0F6E56" />
                  <path d="M600,180 Q650,160 700,180 Q720,200 700,220 Q680,230 650,220 Q620,200 600,180Z" fill="#0F6E56" />
                </svg>

                {/* Project Pins */}
                {projects.map((p) => {
                  // Simple lat/lng to position mapping for Indonesia
                  const x = ((p.location.lng - 95) / (141 - 95)) * 100;
                  const y = ((p.location.lat + 11) / (11 + 6)) * 100;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group ${
                        selectedProject?.id === p.id ? 'z-20' : ''
                      }`}
                      style={{ left: `${Math.max(10, Math.min(90, x))}%`, top: `${Math.max(10, Math.min(90, 100 - y))}%` }}
                    >
                      <div className={`relative ${selectedProject?.id === p.id ? 'scale-125' : ''} transition-transform`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white ${
                          selectedProject?.id === p.id ? 'bg-amber-500 animate-pulse-glow' : 'bg-teal-600'
                        }`}>
                          {typeIcons[p.type] || '📍'}
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                            {p.title}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-sm border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Legenda</p>
                  <div className="space-y-1">
                    {Object.entries(typeIcons).map(([type, icon]) => (
                      <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span>{icon}</span>
                        <span className="capitalize">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-teal-700">{projects.length}</span> proyek aktif
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Project List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold font-heading text-gray-900">Daftar Proyek</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      selectedProject?.id === p.id ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{typeIcons[p.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
                        <p className="text-xs text-gray-500">📍 {p.location.address}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${p.progressPercent}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{p.progressPercent}%</span>
                        </div>
                        <p className="text-xs font-semibold text-teal-700 mt-1">{formatCurrency(p.collectedAmount)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Project Detail */}
              {selectedProject && (
                <div className="p-4 border-t border-gray-100 bg-teal-50">
                  <h4 className="font-bold text-sm text-gray-900">{selectedProject.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{selectedProject.description}</p>
                  <Link href={`/marketplace/${selectedProject.id}`} className="inline-block mt-2">
                    <span className="text-xs text-teal-600 font-semibold hover:text-teal-700">Lihat Detail →</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
