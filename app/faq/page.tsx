export default function FAQPage() {
  const faqs = [
    { q: "Apa itu WaqfChain?", a: "WaqfChain adalah platform penggalangan dana wakaf yang menggunakan teknologi modern untuk memastikan transparansi aliran dana." },
    { q: "Bagaimana cara mulai berwakaf?", a: "Cukup kunjungi halaman Marketplace, pilih proyek, klik Wakaf Sekarang, lalu ikuti instruksi pembayaran via Midtrans." },
    { q: "Apakah dana saya aman?", a: "Ya, kami bekerja sama dengan payment gateway berlisensi dan semua pengeluaran diaudit secara publik di halaman Transparansi." }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-8">Tanya Jawab (FAQ)</h1>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
