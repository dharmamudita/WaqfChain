import Link from 'next/link';
import type { Project } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Leaf, Store, Droplet, Book, Home, MapPin } from 'lucide-react';

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) return `Rp${(amount / 1000000000).toFixed(1)}M`;
  if (amount >= 1000000) return `Rp${(amount / 1000000).toFixed(0)}Jt`;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const typeIcons: Record<string, React.ReactNode> = {
  kebun: <Leaf className="w-3 h-3" />,
  umkm: <Store className="w-3 h-3" />,
  sumur: <Droplet className="w-3 h-3" />,
  pendidikan: <Book className="w-3 h-3" />,
  properti: <Home className="w-3 h-3" />,
};

const typeLabels: Record<string, string> = {
  kebun: 'Kebun',
  umkm: 'UMKM',
  sumur: 'Sumur',
  pendidikan: 'Pendidikan',
  properti: 'Properti',
};

const typeColors: Record<string, 'teal' | 'amber' | 'info' | 'success' | 'warning'> = {
  kebun: 'success',
  umkm: 'amber',
  sumur: 'info',
  pendidikan: 'teal',
  properti: 'warning',
};

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const imageUrl = project.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop';

  return (
    <Link href={`/marketplace/${project.id}`}>
      <div className={`group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-premium relative ${featured ? 'md:col-span-1' : ''}`}>
        {/* Image */}
        <div className="relative h-32 md:h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-4 left-4 z-10">
            <Badge variant={typeColors[project.type] || 'neutral'} size="sm" className="shadow-lg">
              <span className="flex items-center gap-1.5">
                {typeIcons[project.type]}
                {typeLabels[project.type] || project.type}
              </span>
            </Badge>
          </div>
          {project.status === 'aktif' && (
            <div className="absolute top-4 right-4 z-10">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-emerald-600 shadow-lg">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Aktif
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <h3 className="font-bold text-base md:text-lg text-gray-900 font-heading mb-2 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-semibold text-teal-700">
                {formatCurrency(project.collectedAmount)}
              </span>
              <span className="text-xs text-gray-400">
                {project.progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full progress-bar"
                style={{ width: `${Math.min(project.progressPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <span className="text-xs text-gray-400">
                Target: {formatCurrency(project.targetAmount)}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {project.location?.address?.split(',')[0] || 'Indonesia'}
              </span>
            </div>
          </div>

          {/* CTA */}
          <Button variant="primary" size="sm" fullWidth>
            Wakaf Sekarang
          </Button>
        </div>
      </div>
    </Link>
  );
}
