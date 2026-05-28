'use client';

import { useEffect, useState, useMemo } from 'react';
import ProjectFilter from '@/components/marketplace/ProjectFilter';
import ProjectGrid from '@/components/marketplace/ProjectGrid';
import { getProjects } from '@/lib/firestore';
import type { Project, ProjectType } from '@/types';
import { Timestamp } from 'firebase/firestore';

const demoProjects: Project[] = [
  {
    id: '1', title: 'Wakaf Kebun Produktif Cianjur', description: 'Membangun kebun produktif seluas 2 hektar untuk pemberdayaan ekonomi umat di Cianjur, Jawa Barat.', type: 'kebun', targetAmount: 500000000, collectedAmount: 325000000, progressPercent: 65, mediaUrls: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop'], location: { lat: -6.8, lng: 107.1, address: 'Cianjur, Jawa Barat' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
  },
  {
    id: '2', title: 'Sumur Bor Desa Terpencil NTT', description: 'Pembangunan sumur bor untuk akses air bersih di 5 desa terpencil di Nusa Tenggara Timur.', type: 'sumur', targetAmount: 250000000, collectedAmount: 187500000, progressPercent: 75, mediaUrls: ['https://images.unsplash.com/photo-1541544741-207e8c12bc53?w=600&h=400&fit=crop'], location: { lat: -10.1, lng: 123.6, address: 'Kupang, NTT' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
  },
  {
    id: '3', title: 'Beasiswa Pendidikan Anak Yatim', description: 'Program beasiswa pendidikan untuk 100 anak yatim dan dhuafa di seluruh Indonesia.', type: 'pendidikan', targetAmount: 1000000000, collectedAmount: 420000000, progressPercent: 42, mediaUrls: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop'], location: { lat: -6.2, lng: 106.8, address: 'Jakarta, Indonesia' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
  },
  {
    id: '4', title: 'Wakaf UMKM Batik Pekalongan', description: 'Modal usaha untuk pengembangan industri batik rumahan oleh ibu-ibu di Pekalongan.', type: 'umkm', targetAmount: 300000000, collectedAmount: 120000000, progressPercent: 40, mediaUrls: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop'], location: { lat: -6.89, lng: 109.67, address: 'Pekalongan, Jawa Tengah' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
  },
  {
    id: '5', title: 'Pembangunan Masjid Desa Sulawesi', description: 'Pembangunan masjid permanen di desa terpencil di Sulawesi Tengah.', type: 'properti', targetAmount: 750000000, collectedAmount: 450000000, progressPercent: 60, mediaUrls: ['https://images.unsplash.com/photo-1585036156171-384164a8c8df?w=600&h=400&fit=crop'], location: { lat: -1.43, lng: 121.45, address: 'Palu, Sulawesi Tengah' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
  },
  {
    id: '6', title: 'Wakaf Kebun Kurma Aceh', description: 'Penanaman 500 pohon kurma di lahan wakaf untuk kemandirian pangan umat.', type: 'kebun', targetAmount: 400000000, collectedAmount: 80000000, progressPercent: 20, mediaUrls: ['https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=400&fit=crop'], location: { lat: 5.55, lng: 95.32, address: 'Banda Aceh' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
  },
];

export default function MarketplacePage() {
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ProjectType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getProjects()
      .then((data) => {
        if (data.length > 0) setProjects(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchType = !selectedType || p.type === selectedType;
      const matchSearch = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [projects, selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading mb-3">
            Marketplace Wakaf
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl">
            Temukan proyek wakaf yang sesuai dengan minat Anda dan mulai berkontribusi untuk masa depan yang lebih baik.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <ProjectFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-gray-900">{filteredProjects.length}</span> proyek
          </p>
        </div>

        {/* Grid */}
        <ProjectGrid projects={filteredProjects} loading={loading} />
      </div>
    </div>
  );
}
