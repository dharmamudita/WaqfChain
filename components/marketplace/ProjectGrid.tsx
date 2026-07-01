import type { Project } from '@/types';
import ProjectCard from '@/components/homepage/ProjectCard';
import { Search } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
}

export default function ProjectGrid({ projects, loading }: ProjectGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse shadow-premium">
            <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-5 bg-gray-200 rounded-full w-3/4" />
              <div className="h-4 bg-gray-100 rounded-full w-full" />
              <div className="h-4 bg-gray-100 rounded-full w-2/3" />
              <div className="h-2.5 bg-gray-100 rounded-full w-full" />
              <div className="h-11 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-premium border border-gray-100 flex flex-col items-center">
        <div className="w-24 h-24 bg-teal-50 text-teal-300 rounded-full flex items-center justify-center mb-5">
          <Search size={48} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">
          Tidak Ada Proyek Ditemukan
        </h3>
        <p className="text-gray-500 text-sm">
          Coba ubah filter atau kata kunci pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
