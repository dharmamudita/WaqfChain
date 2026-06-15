'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from '@/lib/auth';
import { getUser } from '@/lib/firestore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await signIn(email, password);
      const userData = await getUser(user.uid);

      // Set cookies for middleware
      const token = await user.getIdToken();
      document.cookie = `auth-token=${token}; path=/; max-age=86400`;
      document.cookie = `user-role=${userData?.role || 'user'}; path=/; max-age=86400`;

      toast.success('Berhasil masuk!');
      window.location.href = redirect;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal masuk';
      if (message.includes('user-not-found')) {
        toast.error('Akun tidak ditemukan');
      } else if (message.includes('wrong-password')) {
        toast.error('Password salah');
      } else {
        toast.error('Gagal masuk. Periksa email dan password Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 py-12 px-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -left-[10%] w-[50%] h-[50%] bg-amber-500/15 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 bg-teal-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative w-14 h-14 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex items-center justify-center">
                <Image src="/logo.png" alt="WaqfChain" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
            </Link>
            <h1 className="text-2xl font-extrabold font-heading text-gray-900 mb-2">Selamat Datang!</h1>
            <p className="text-gray-500 text-sm">Masuk untuk melanjutkan wakaf digital Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
            <Input
              label="Password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="!py-4 !text-base !shadow-xl !shadow-teal-500/25">
                Masuk
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{' '}
              <Link href="/register" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
