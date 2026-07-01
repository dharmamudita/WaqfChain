'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createProject, updateProject, getProject, getCategories } from '@/lib/firestore';
import { uploadImage } from '@/lib/firestore';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { CheckCircle, Rocket } from 'lucide-react';
import type { ProjectType, ProjectCategory } from '@/types';

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



const MapPicker = dynamic(() => import('@/components/admin/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Memuat peta...</div>
});


export default function ProjectForm({ projectId }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [initialLocation, setInitialLocation] = useState<{lat: number, lng: number} | undefined>(undefined);
  const router = useRouter();
  const isEdit = !!projectId;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProjectFormData>();

  useEffect(() => {
    getCategories().then(setCategories);
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
          setInitialLocation({ lat: p.location.lat, lng: p.location.lng });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 2MB');
      return;
    }

    const toastId = toast.loading('Mengunggah gambar...');
    try {
      const url = await uploadImage(file, 'projects');
      setMediaUrls(prev => [...prev, url]);
      toast.success('Gambar berhasil diunggah', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengunggah gambar', { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-premium space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900">Informasi Proyek</h3>
            <p className="text-xs text-gray-400">Detail dasar tentang proyek wakaf</p>
          </div>
        </div>

        <Input label="Judul Proyek" placeholder="Masukkan judul proyek" {...register('title', { required: 'Judul wajib diisi' })} error={errors.title?.message} />

        <Textarea label="Deskripsi" placeholder="Deskripsikan proyek wakaf ini..." {...register('description', { required: 'Deskripsi wajib diisi' })} error={errors.description?.message} />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipe Proyek</label>
          <select
            {...register('type', { required: 'Tipe proyek wajib dipilih' })}
            defaultValue=""
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all text-sm"
          >
            <option value="" disabled>Pilih Tipe Proyek</option>
            {categories.length === 0 ? (
              <option value="" disabled>-- Belum ada tipe proyek --</option>
            ) : (
              categories.map((c) => (
                <option key={c.id} value={c.label}>{c.label}</option>
              ))
            )}
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <Input 
          label="Target Dana" 
          type="number" 
          placeholder="500000000" 
          leftIcon={<span className="font-semibold text-gray-500 text-sm">Rp</span>}
          {...register('targetAmount', { required: 'Target dana wajib diisi' })} 
          error={errors.targetAmount?.message} 
        />
      </div>

      {/* Location */}
      <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-premium space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900">Lokasi</h3>
            <p className="text-xs text-gray-400">Pilih lokasi proyek di peta</p>
          </div>
        </div>
        
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          {(!isEdit || initialLocation) ? (
            <MapPicker 
              defaultLocation={initialLocation}
              onChange={(lat, lng) => {
                setValue('lat', lat, { shouldValidate: true });
                setValue('lng', lng, { shouldValidate: true });
              }}
            />
          ) : (
            <div className="h-[400px] bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 text-sm">Memuat data lokasi...</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 hidden">
          <Input label="Latitude" type="number" step="any" placeholder="-6.2088" {...register('lat', { required: 'Pilih lokasi di peta' })} />
          <Input label="Longitude" type="number" step="any" placeholder="106.8456" {...register('lng', { required: 'Pilih lokasi di peta' })} />
        </div>
        
        {errors.lat && <p className="text-red-500 text-sm mt-1">{errors.lat.message}</p>}

        <Input label="Alamat / Deskripsi Lokasi Singkat" placeholder="Misal: Desa Margajaya, Kec. Cianjur" {...register('address', { required: 'Alamat wajib diisi' })} error={errors.address?.message} />
      </div>

      {/* Media */}
      <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-premium space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900">Media</h3>
            <p className="text-xs text-gray-400">Upload gambar proyek (maks 2MB per file)</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mediaUrls.map((url, idx) => (
            <div key={idx} className="relative h-28 rounded-2xl overflow-hidden group shadow-sm">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
              <button
                type="button"
                onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <label className="h-28 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50/30 transition-all duration-200 cursor-pointer">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xs font-medium">Upload</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" size="lg" loading={loading} className="!px-8 flex items-center gap-2">
          {isEdit ? <><CheckCircle className="w-5 h-5" /> Simpan Perubahan</> : <><Rocket className="w-5 h-5" /> Tambah Proyek</>}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
