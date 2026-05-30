export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-6">Syarat & Ketentuan</h1>
        <div className="prose prose-teal max-w-none text-gray-600 space-y-4">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          <p>Selamat datang di WaqfChain. Dengan menggunakan platform ini, Anda setuju untuk mematuhi dan terikat oleh syarat dan ketentuan penggunaan berikut:</p>
          <h2 className="text-xl font-bold font-heading text-gray-900 mt-6 mb-2">1. Penggunaan Platform</h2>
          <p>Anda setuju untuk menggunakan platform ini hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku di Indonesia.</p>
          <h2 className="text-xl font-bold font-heading text-gray-900 mt-6 mb-2">2. Donasi & Wakaf</h2>
          <p>Setiap donasi yang masuk bersifat final dan tidak dapat dikembalikan (non-refundable). Kami menjamin dana Anda disalurkan sesuai dengan proyek yang Anda pilih.</p>
          <h2 className="text-xl font-bold font-heading text-gray-900 mt-6 mb-2">3. Transparansi</h2>
          <p>Kami berkomitmen untuk melaporkan setiap pengeluaran di halaman Transparansi secara berkala.</p>
        </div>
      </div>
    </div>
  );
}
