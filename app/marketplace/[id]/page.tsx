'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProject, getProjectDonors } from '@/lib/firestore';
import DonateModal from '@/components/marketplace/DonateModal';
import Badge, { getStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Project, Transaction } from '@/types';
import dynamic from 'next/dynamic';
import { Timestamp } from 'firebase/firestore';
import { Leaf, Store, Droplet, Book, Home, MapPin, Heart, MessageCircle, Share2, Link as LinkIcon } from 'lucide-react';

const MapViewer = dynamic(() => import('@/components/ui/MapViewer'), { ssr: false });

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const typeLabels: Record<string, string> = {
  kebun: 'Kebun', umkm: 'UMKM', sumur: 'Sumur', pendidikan: 'Pendidikan', properti: 'Properti',
};

const typeIcons: Record<string, React.ReactNode> = {
  kebun: <Leaf className="w-3 h-3" />,
  umkm: <Store className="w-3 h-3" />,
  sumur: <Droplet className="w-3 h-3" />,
  pendidikan: <Book className="w-3 h-3" />,
  properti: <Home className="w-3 h-3" />,
};


export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [donors, setDonors] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;

    Promise.all([
      getProject(id).catch(() => null),
      getProjectDonors(id).catch(() => []),
    ])
      .then(([proj, don]) => {
        setProject(proj);
        setDonors(don);
      })
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        {/* Skeleton Header */}
        <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 pt-28 pb-24" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
          <div className="animate-pulse space-y-6">
            <div className="h-80 bg-white rounded-3xl shadow-premium" />
            <div className="h-8 bg-gray-200 rounded-full w-2/3" />
            <div className="h-4 bg-gray-100 rounded-full w-full" />
            <div className="h-4 bg-gray-100 rounded-full w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const statusBadge = getStatusBadge(project.status);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Yuk wakaf untuk proyek "${project.title}" di WaqfChain!`;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Dark Header Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 pt-28 pb-32 md:pt-36 md:pb-40">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-teal-300/70 mb-4">
            <a href="/marketplace" className="hover:text-white transition-colors">Marketplace</a>
            <span>›</span>
            <span className="text-teal-100 truncate max-w-[300px]">{project.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content - overlapping header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Image & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative h-72 md:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={project.mediaUrls[selectedImage] || project.mediaUrls[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-5 left-5 flex gap-2">
                  <Badge variant={getStatusBadge(project.type).variant || 'teal'} className="shadow-lg backdrop-blur-sm">
                    <span className="flex items-center gap-1.5">{typeIcons[project.type]} {typeLabels[project.type] || project.type}</span>
                  </Badge>
                  <Badge variant={statusBadge.variant} className="shadow-lg backdrop-blur-sm">{statusBadge.label}</Badge>
                </div>
                {/* Image counter */}
                {project.mediaUrls.length > 1 && (
                  <div className="absolute bottom-5 right-5 glass-dark px-3 py-1.5 rounded-full text-white text-xs font-bold">
                    {selectedImage + 1} / {project.mediaUrls.length}
                  </div>
                )}
              </div>
              {project.mediaUrls.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {project.mediaUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === idx ? 'border-teal-500 shadow-lg shadow-teal-500/20 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-premium">
              <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-gray-900 mb-4">
                {project.title}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-500">
                  <MapPin className="w-4 h-4" /> {project.location.address}
                </span>
              </div>
              <div className="prose prose-gray max-w-none">
                {project.description.split('\n').map((p, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-3">{p}</p>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-premium overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-gray-900">Lokasi Proyek</h3>
                  <p className="text-xs text-gray-400">{project.location.address}</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <MapViewer 
                  markers={[{
                    id: project.id,
                    lat: project.location.lat,
                    lng: project.location.lng,
                    title: project.title,
                    address: project.location.address
                  }]}
                  className="w-full h-[350px]"
                />
              </div>
            </div>

            {/* Donors */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-premium">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-heading text-gray-900">Riwayat Donatur</h3>
                    <p className="text-xs text-gray-400">{donors.length} orang telah berkontribusi</p>
                  </div>
                </div>
              </div>
              {donors.length > 0 ? (
                <div className="space-y-3">
                  {donors.slice(0, 10).map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-2xl hover:bg-teal-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {d.donorName || (d.userId !== 'guest' ? `Wakif #${d.userId.slice(-6)}` : 'Hamba Allah')}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-teal-700">{formatCurrency(d.amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50/50 rounded-2xl">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-teal-300" />
                  <p className="text-gray-400 text-sm">Belum ada donatur. Jadilah yang pertama!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Donation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">
              {/* Main Donate Card */}
              <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-premium">
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Terkumpul</p>
                  <p className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                    {formatCurrency(project.collectedAmount)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">dari target {formatCurrency(project.targetAmount)}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 rounded-full progress-bar relative"
                      style={{ width: `${Math.min(project.progressPercent, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs font-bold text-teal-700">{project.progressPercent}%</span>
                    <span className="text-xs text-gray-400">{donors.length} wakif</span>
                  </div>
                </div>

                <Button variant="primary" size="lg" fullWidth onClick={() => setShowDonateModal(true)} className="!text-base !py-4 !shadow-xl !shadow-teal-500/20">
                  <Heart className="w-5 h-5 fill-current" /> Wakaf Sekarang
                </Button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  Mulai dari <span className="font-bold text-teal-600">Rp10.000</span>
                </p>
              </div>

              {/* Share */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-premium">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Bagikan proyek ini</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center gap-3 w-full py-3 px-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-semibold hover:bg-emerald-100 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-3 w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-2xl text-sm font-semibold hover:bg-blue-100 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-3 w-full py-3 px-4 bg-gray-50 text-gray-700 rounded-2xl text-sm font-semibold hover:bg-gray-100 transition-all"
                  >
                    <LinkIcon className="w-5 h-5" />
                    Salin Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      <DonateModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        project={project}
      />
    </div>
  );
}
