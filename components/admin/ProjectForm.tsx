'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createProject, updateProject, getProject } from '@/lib/firestore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import type { ProjectType } from '@/types';

interface ProjectFormData {
  title: string;
  description: string;
  type: ProjectType;
  targetAmount: number;
  lat: number;
  lng: number;
  address: string;
}

interface ProjectFormProps {
  projectId?: string;
}

const projectTypes: { value: ProjectType; label: string }[] = [
  { value: 'kebun', label: '🌱 Kebun' },
  { value: 'umkm', label: '🏪 UMKM' },
  { value: 'sumur', label: '💧 Sumur' },
  { value: 'pendidikan', label: '📚 Pendidikan' },
  { value: 'properti', label: '🏠 Properti' },
];

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const router = useRouter();
  const isEdit = !!projectId;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProjectFormData>();

  useEffect(() => {
    if (projectId) {
      getProject(projectId).then((p) => {
        if (p) {
          setValue('title', p.title);
          setValue('description', p.description);
          setValue('type', p.type);
          setValue('targetAmount', p.targetAmount);
          setValue('lat', p.location.lat);
          setValue('lng', p.location.lng);
          setValue('address', p.location.address);
          setMediaUrls(p.mediaUrls);
        }
      });
    }
  }, [projectId, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      const projectData = {
        title: data.title,
        description: data.description,
        type: data.type,
        targetAmount: Number(data.targetAmount),
        mediaUrls,
        location: {
          lat: Number(data.lat),
          lng: Number(data.lng),
          address: data.address,
        },
        status: 'aktif' as const,
      };

      if (isEdit && projectId) {
        await updateProject(projectId, projectData);
        toast.success('Proyek berhasil diperbarui');
      } else {
        await createProject(projectData);
        toast.success('Proyek berhasil ditambahkan');
      }
      router.push('/admin');
    } catch {
      toast.error('Gagal menyimpan proyek');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUrlAdd = () => {
    const url = prompt('Masukkan URL gambar:');
    if (url) setMediaUrls([...mediaUrls, url]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
        <h3 className="text-lg font-bold font-heading text-gray-900">
          {isEdit ? 'Edit Proyek' : 'Tambah Proyek Baru'}
        </h3>

        <Input label="Judul Proyek" placeholder="Masukkan judul proyek" {...register('title', { required: 'Judul wajib diisi' })} error={errors.title?.message} />

        <Textarea label="Deskripsi" placeholder="Deskripsikan proyek wakaf ini..." {...register('description', { required: 'Deskripsi wajib diisi' })} error={errors.description?.message} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe Proyek</label>
          <select
            {...register('type', { required: true })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {projectTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <Input label="Target Dana (Rp)" type="number" placeholder="500000000" {...register('targetAmount', { required: 'Target dana wajib diisi', min: 1000000 })} error={errors.targetAmount?.message} />
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
        <h3 className="text-lg font-bold font-heading text-gray-900">Lokasi</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Latitude" type="number" step="any" placeholder="-6.2088" {...register('lat')} />
          <Input label="Longitude" type="number" step="any" placeholder="106.8456" {...register('lng')} />
        </div>
        <Input label="Alamat" placeholder="Jakarta, Indonesia" {...register('address')} />
      </div>

      {/* Media */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-lg font-bold font-heading text-gray-900">Media</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mediaUrls.map((url, idx) => (
            <div key={idx} className="relative h-24 rounded-xl overflow-hidden group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleMediaUrlAdd}
            className="h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs">Tambah</span>
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          {isEdit ? 'Simpan Perubahan' : 'Tambah Proyek'}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
