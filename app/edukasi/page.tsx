'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Book, Scale, Sprout, Diamond, Link as LinkIcon, BookOpen } from 'lucide-react';

const sections = [
  {
    icon: <Book className="w-8 h-8 text-teal-600" />,
    title: 'Apa Itu Wakaf?',
    content:
      'Wakaf adalah perbuatan ibadah dengan menyerahkan sebagian harta yang dimiliki untuk dimanfaatkan selamanya atau dalam jangka waktu tertentu guna keperluan ibadah dan kesejahteraan umum. Dalam Islam, wakaf merupakan salah satu bentuk sedekah jariyah yang pahalanya terus mengalir meskipun pewakaf telah meninggal dunia.',
  },
  {
    icon: <Scale className="w-8 h-8 text-teal-600" />,
    title: 'Dasar Hukum Wakaf',
    content:
      'Wakaf diatur dalam UU No. 41 Tahun 2004 tentang Wakaf dan PP No. 42 Tahun 2006. Dalam Al-Quran, dasar wakaf terdapat pada Surah Ali Imran ayat 92: "Kamu sekali-kali tidak sampai kepada kebajikan (yang sempurna), sebelum kamu menafkahkan sebahagian harta yang kamu cintai." Hadis Nabi SAW juga menyebutkan: "Jika anak Adam meninggal dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, dan anak shalih yang mendoakannya."',
  },
  {
    icon: <Sprout className="w-8 h-8 text-teal-600" />,
    title: 'Jenis-Jenis Wakaf',
    items: [
      { name: 'Wakaf Tunai (Uang)', desc: 'Mewakafkan sejumlah uang untuk dikelola dan hasilnya digunakan untuk kepentingan umum.' },
      { name: 'Wakaf Produktif', desc: 'Wakaf yang dikelola secara produktif sehingga menghasilkan keuntungan yang disalurkan untuk kepentingan sosial.' },
      { name: 'Wakaf Tanah', desc: 'Mewakafkan tanah untuk pembangunan masjid, sekolah, panti asuhan, atau fasilitas umum.' },
      { name: 'Wakaf Properti', desc: 'Mewakafkan bangunan, rumah, atau aset properti lainnya.' },
      { name: 'Wakaf Digital', desc: 'Wakaf melalui platform digital yang memudahkan proses dan meningkatkan transparansi.' },
    ],
  },
  {
    icon: <Diamond className="w-8 h-8 text-teal-600" />,
    title: 'Manfaat Wakaf',
    items: [
      { name: 'Pahala Abadi', desc: 'Wakaf termasuk sedekah jariyah yang pahalanya terus mengalir.' },
      { name: 'Pemberdayaan Umat', desc: 'Membantu meningkatkan kesejahteraan masyarakat yang membutuhkan.' },
      { name: 'Investasi Akhirat', desc: 'Harta yang diwakafkan menjadi investasi untuk kehidupan setelah dunia.' },
      { name: 'Pembangunan Sosial', desc: 'Berkontribusi pada pembangunan fasilitas pendidikan, kesehatan, dan ekonomi.' },
    ],
  },
  {
    icon: <LinkIcon className="w-8 h-8 text-teal-600" />,
    title: 'Kenapa WaqfChain?',
    items: [
      { name: 'Transparan', desc: 'Setiap penggunaan dana tercatat dan dapat dipantau secara real-time.' },
      { name: 'Mudah & Cepat', desc: 'Berwakaf mulai dari Rp10.000 melalui berbagai metode pembayaran.' },
      { name: 'Sertifikat Digital', desc: 'Dapatkan sertifikat digital dengan QR code sebagai bukti wakaf.' },
      { name: 'Terpercaya', desc: 'Dikelola oleh tim profesional dengan akuntabilitas tinggi.' },
    ],
  },
];

export default function EdukasiPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <span className="flex items-center gap-1.5 text-sm font-medium text-teal-100"><BookOpen className="w-4 h-4" /> Pusat Edukasi</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading mb-4">
            Memahami <span className="text-amber-300">Wakaf</span> Lebih Dalam
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Pelajari tentang wakaf, manfaatnya, dan bagaimana WaqfChain membuat wakaf lebih mudah dan transparan.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div>{section.icon}</div>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-gray-900">{section.title}</h2>
            </div>
            {section.content && (
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            )}
            {section.items && (
              <div className="space-y-4 mt-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* CTA */}
        <div className="text-center pt-8">
          <h3 className="text-2xl font-bold font-heading text-gray-900 mb-3">
            Siap Memulai Wakaf?
          </h3>
          <p className="text-gray-500 mb-6">
            Mulai kontribusi Anda untuk masa depan umat yang lebih baik.
          </p>
          <Link href="/marketplace">
            <Button variant="primary" size="lg">
              Mulai Wakaf Sekarang →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
