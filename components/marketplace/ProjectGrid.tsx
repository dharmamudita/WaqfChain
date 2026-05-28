import type { Project } from '@/types';
import ProjectCard from '@/components/homepage/ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
}

export default function ProjectGrid({ projects, loading }: ProjectGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-2 bg-gray-100 rounded-full w-full" />
              <div className="h-10 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">
          Tidak Ada Proyek Ditemukan
        </h3>
        <p className="text-gray-500">
          Coba ubah filter atau kata kunci pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
