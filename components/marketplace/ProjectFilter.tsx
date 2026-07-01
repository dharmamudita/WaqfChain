'use client';

import type { ProjectType, ProjectCategory } from '@/types';
import { Globe, Leaf, Store, Droplet, Book, Home, FolderOpen } from 'lucide-react';

const getCategoryIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('kebun')) return <Leaf className="w-4 h-4" />;
  if (l.includes('umkm')) return <Store className="w-4 h-4" />;
  if (l.includes('sumur') || l.includes('air')) return <Droplet className="w-4 h-4" />;
  if (l.includes('pendidikan')) return <Book className="w-4 h-4" />;
  if (l.includes('properti')) return <Home className="w-4 h-4" />;
  return <FolderOpen className="w-4 h-4" />;
};

interface ProjectFilterProps {
  selectedType: ProjectType | '';
  onTypeChange: (type: ProjectType | '') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: ProjectCategory[];
}

export default function ProjectFilter({ selectedType, onTypeChange, searchQuery, onSearchChange, categories }: ProjectFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Cari proyek wakaf..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
        />
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTypeChange('')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedType === ''
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-700'
          }`}
        >
          <Globe className="w-4 h-4" />
          Semua
        </button>
        {categories.map((type) => (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.label)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedType === type.label
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-700'
            }`}
          >
            {getCategoryIcon(type.label)}
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
