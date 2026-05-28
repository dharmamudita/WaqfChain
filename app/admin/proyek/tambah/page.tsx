import ProjectForm from '@/components/admin/ProjectForm';

export default function TambahProyekPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold font-heading text-gray-900">Tambah Proyek Baru</h1>
        <p className="text-sm text-gray-500">Buat proyek wakaf baru untuk ditampilkan di marketplace</p>
      </div>
      <ProjectForm />
    </div>
  );
}
