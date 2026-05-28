'use client';

import { useEffect, useState, useMemo } from 'react';
import ProjectFilter from '@/components/marketplace/ProjectFilter';
import ProjectGrid from '@/components/marketplace/ProjectGrid';
import { getProjects } from '@/lib/firestore';
import type { Project, ProjectType } from '@/types';
import { Timestamp } from 'firebase/firestore';


export default function MarketplacePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ProjectType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
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
