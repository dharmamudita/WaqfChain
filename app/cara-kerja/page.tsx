export default function CaraKerjaPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-6">Cara Kerja WaqfChain</h1>
        <div className="space-y-8 mt-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0">1</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pilih Proyek Wakaf</h3>
              <p className="text-gray-600">Jelajahi berbagai proyek wakaf yang tersedia di Marketplace kami. Setiap proyek telah diverifikasi oleh tim internal kami.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0">2</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lakukan Berwakaf</h3>
              <p className="text-gray-600">Gunakan metode pembayaran yang aman via Midtrans. Dana yang masuk akan langsung dikunci dalam sistem pencatatan kami.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0">3</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Penyaluran & Pencatatan Blockchain</h3>
              <p className="text-gray-600">Admin/Nazhir akan menggunakan dana tersebut dan mencatat pengeluarannya. Semua tercatat secara transparan di dashboard publik.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
