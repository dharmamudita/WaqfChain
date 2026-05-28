import type { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'WaqfChain - Platform Wakaf Digital Transparan',
  description:
    'WaqfChain adalah platform wakaf digital transparan yang memudahkan Anda berwakaf secara online. Mulai wakaf dari Rp10.000 untuk masa depan umat yang lebih baik.',
  keywords: ['wakaf', 'wakaf digital', 'wakaf online', 'waqf', 'blockchain', 'transparan'],
  openGraph: {
    title: 'WaqfChain - Platform Wakaf Digital Transparan',
    description: 'Berwakaf mudah, transparan, dan berdampak bersama WaqfChain.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  const snapUrl = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#111827',
              borderRadius: '12px',
              border: '1px solid #f3f4f6',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#0F6E56',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Script
          src={snapUrl}
          data-client-key={midtransClientKey}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
