'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/firestore';
import Badge from '@/components/ui/Badge';
import type { MapMarker } from '@/components/ui/MapViewer';
import type { Project } from '@/types';
import dynamic from 'next/dynamic';

const MapViewer = dynamic(() => import('@/components/ui/MapViewer'), { ssr: false });
import { Timestamp } from 'firebase/firestore';


const typeIcons: Record<string, string> = {
  kebun: '🌱', umkm: '🏪', sumur: '💧', pendidikan: '📚', properti: '🏠',
};

function formatCurrency(amount: number) {
  if (amount >= 1000000000) return `Rp${(amount / 1000000000).toFixed(1)}M`;
  if (amount >= 1000000) return `Rp${(amount / 1000000).toFixed(0)}Jt`;
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export default function PetaPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjects({ status: 'aktif' })
      .then((data) => {
        setProjects(data);
      })
      .catch(console.error);
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-[600px] relative">
              <MapViewer 
                markers={projects.map(p => ({
                  id: p.id,
                  lat: p.location.lat,
                  lng: p.location.lng,
                  title: p.title,
                  address: p.location.address,
                  linkUrl: `/marketplace/${p.id}`
                }))}
                className="w-full h-full"
              />

              {/* Float overlays inside Map Container but above Leaflet */}
              <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur rounded-xl p-3 shadow-sm border border-gray-100 pointer-events-none">
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

              <div className="absolute top-6 right-6 z-[1000] bg-white/90 backdrop-blur rounded-xl px-4 py-2 shadow-sm border border-gray-100 pointer-events-none">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-teal-700">{projects.length}</span> proyek aktif
                </p>
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
