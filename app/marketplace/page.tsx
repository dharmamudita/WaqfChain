'use client';

import { useEffect, useState, useMemo } from 'react';
import ProjectFilter from '@/components/marketplace/ProjectFilter';
import ProjectGrid from '@/components/marketplace/ProjectGrid';
import { getProjects, getCategories } from '@/lib/firestore';
import type { Project, ProjectType, ProjectCategory } from '@/types';
import { Timestamp } from 'firebase/firestore';


export default function MarketplacePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ProjectType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([getProjects(), getCategories()])
      .then(([projectsData, categoriesData]) => {
        setProjects(projectsData);
        setCategories(categoriesData);
      })
      .catch(console.error)
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
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 text-xs font-medium text-teal-200">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {projects.length} Proyek Tersedia
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading mb-4">
            Marketplace <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Wakaf</span>
          </h1>
          <p className="text-teal-200/80 text-lg max-w-2xl leading-relaxed">
            Temukan proyek wakaf yang sesuai dengan minat Anda dan mulai berkontribusi untuk masa depan yang lebih baik.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6 mb-8 -mt-12 relative z-10">
          <ProjectFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-bold text-gray-900">{filteredProjects.length}</span> proyek
          </p>
        </div>

        {/* Grid */}
        <ProjectGrid projects={filteredProjects} loading={loading} />
      </div>
    </div>
  );
}
