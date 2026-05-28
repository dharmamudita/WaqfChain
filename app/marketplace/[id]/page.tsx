'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProject, getProjectDonors } from '@/lib/firestore';
import DonateModal from '@/components/marketplace/DonateModal';
import Badge, { getStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Project, Transaction } from '@/types';
import { Timestamp } from 'firebase/firestore';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

const typeLabels: Record<string, string> = {
  kebun: '🌱 Kebun', umkm: '🏪 UMKM', sumur: '💧 Sumur', pendidikan: '📚 Pendidikan', properti: '🏠 Properti',
};

const demoProject: Project = {
  id: '1', title: 'Wakaf Kebun Produktif Cianjur', description: 'Membangun kebun produktif seluas 2 hektar untuk pemberdayaan ekonomi umat di Cianjur, Jawa Barat. Program ini bertujuan menciptakan kemandirian ekonomi masyarakat melalui pertanian organik yang berkelanjutan.\n\nLahan wakaf akan ditanami berbagai komoditas seperti sayuran organik, buah-buahan, dan tanaman herbal. Hasil panen akan dijual dan keuntungannya disalurkan untuk program-program sosial di sekitar lokasi.\n\nTarget penerima manfaat langsung: 200+ keluarga.', type: 'kebun', targetAmount: 500000000, collectedAmount: 325000000, progressPercent: 65, mediaUrls: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&h=500&fit=crop'], location: { lat: -6.8, lng: 107.1, address: 'Cianjur, Jawa Barat' }, status: 'aktif', createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
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
        setProject(proj || demoProject);
        setDonors(don);
      })
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-gray-200 rounded-2xl" />
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const statusBadge = getStatusBadge(project.status);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Image & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
                <img
                  src={project.mediaUrls[selectedImage] || project.mediaUrls[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant={getStatusBadge(project.type).variant || 'teal'}>{typeLabels[project.type]}</Badge>
                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                </div>
              </div>
              {project.mediaUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {project.mediaUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-teal-500 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-gray-900 mb-4">
                {project.title}
              </h1>
              <div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
                <span>📍 {project.location.address}</span>
              </div>
              <div className="prose prose-gray max-w-none">
                {project.description.split('\n').map((p, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-3">{p}</p>
                ))}
              </div>
            </div>

            {/* Donors */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold font-heading text-gray-900 mb-4">
                Riwayat Donatur ({donors.length})
              </h3>
              {donors.length > 0 ? (
                <div className="space-y-3">
                  {donors.slice(0, 10).map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-sm font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-gray-700">Wakif #{d.userId.slice(-6)}</span>
                      </div>
                      <span className="text-sm font-semibold text-teal-700">{formatCurrency(d.amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">Belum ada donatur. Jadilah yang pertama!</p>
              )}
            </div>
          </div>

          {/* Right - Donation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Terkumpul</p>
                  <p className="text-2xl font-extrabold font-heading text-teal-700">
                    {formatCurrency(project.collectedAmount)}
                  </p>
                  <p className="text-xs text-gray-400">dari target {formatCurrency(project.targetAmount)}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full progress-bar"
                      style={{ width: `${Math.min(project.progressPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">{project.progressPercent}%</span>
                    <span className="text-xs text-gray-400">{donors.length} wakif</span>
                  </div>
                </div>

                <Button variant="primary" size="lg" fullWidth onClick={() => setShowDonateModal(true)}>
                  💚 Wakaf Sekarang
                </Button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Mulai dari Rp10.000
                </p>
              </div>

              {/* Share */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">Bagikan proyek ini</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                    WhatsApp
                  </button>
                  <button className="flex-1 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
                    Facebook
                  </button>
                  <button className="flex-1 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors">
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
