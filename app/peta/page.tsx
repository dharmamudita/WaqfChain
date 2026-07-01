'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/firestore';
import Badge from '@/components/ui/Badge';
import type { MapMarker } from '@/components/ui/MapViewer';
import type { Project } from '@/types';
import dynamic from 'next/dynamic';
import { Leaf, Store, Droplet, Book, Home, MapPin } from 'lucide-react';

const MapViewer = dynamic(() => import('@/components/ui/MapViewer'), { ssr: false });
import { Timestamp } from 'firebase/firestore';


const typeIcons: Record<string, React.ReactNode> = {
  kebun: <Leaf className="w-4 h-4" />, 
  umkm: <Store className="w-4 h-4" />, 
  sumur: <Droplet className="w-4 h-4" />, 
  pendidikan: <Book className="w-4 h-4" />, 
  properti: <Home className="w-4 h-4" />,
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
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 text-xs font-medium text-teal-200">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {projects.length} Lokasi Terdaftar
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading mb-4">
            Peta Proyek <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Wakaf</span>
          </h1>
          <p className="text-teal-200/80 text-lg max-w-2xl leading-relaxed">
            Lihat lokasi proyek wakaf WaqfChain yang tersebar di seluruh Indonesia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 -mt-12 relative z-10">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-4 h-[600px] relative overflow-hidden">
              <MapViewer 
                markers={projects.map(p => ({
                  id: p.id,
                  lat: p.location.lat,
                  lng: p.location.lng,
                  title: p.title,
                  address: p.location.address,
                  linkUrl: `/marketplace/${p.id}`
                }))}
                className="w-full h-full rounded-2xl"
              />

              {/* Float overlays inside Map Container but above Leaflet */}
              <div className="absolute bottom-6 left-6 z-[1000] glass rounded-2xl p-3 shadow-lg pointer-events-none">
                <p className="text-xs font-bold text-gray-700 mb-2">Legenda</p>
                <div className="space-y-1">
                  {Object.entries(typeIcons).map(([type, icon]) => (
                    <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="text-teal-600">{icon}</span>
                      <span className="capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute top-6 right-6 z-[1000] glass rounded-2xl px-4 py-2 shadow-lg pointer-events-none">
                <p className="text-xs text-gray-500">
                  <span className="font-bold text-teal-700">{projects.length}</span> proyek aktif
                </p>
              </div>
            </div>
          </div>

          {/* Project List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden h-[600px] flex flex-col">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold font-heading text-gray-900">Daftar Proyek</h3>
                <p className="text-xs text-gray-400 mt-0.5">{projects.length} proyek aktif</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full text-left p-4 border-b border-gray-50 hover:bg-teal-50/50 transition-all duration-200 ${
                      selectedProject?.id === p.id ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-teal-600 mt-0.5">{typeIcons[p.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{p.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location.address}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" style={{ width: `${p.progressPercent}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-400">{p.progressPercent}%</span>
                        </div>
                        <p className="text-xs font-bold text-teal-700 mt-1">{formatCurrency(p.collectedAmount)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Project Detail */}
              {selectedProject && (
                <div className="p-5 border-t border-gray-100 bg-gradient-to-r from-teal-50 to-emerald-50">
                  <h4 className="font-bold text-sm text-gray-900">{selectedProject.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{selectedProject.description}</p>
                  <Link href={`/marketplace/${selectedProject.id}`} className="inline-block mt-2">
                    <span className="text-xs text-teal-600 font-bold hover:text-teal-700 transition-colors">Lihat Detail →</span>
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
