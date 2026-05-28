'use client';

import { useParams } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';

export default function EditProyekPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold font-heading text-gray-900">Edit Proyek</h1>
        <p className="text-sm text-gray-500">Perbarui informasi proyek wakaf</p>
      </div>
      <ProjectForm projectId={id} />
    </div>
  );
}
