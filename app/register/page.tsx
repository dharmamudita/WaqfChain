'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      const user = await signUp(email, password, name);
      const token = await user.getIdToken();
      document.cookie = `auth-token=${token}; path=/; max-age=86400`;
      document.cookie = `user-role=user; path=/; max-age=86400`;

      toast.success('Pendaftaran berhasil! Selamat datang.');
      router.push('/marketplace');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mendaftar';
      if (message.includes('email-already-in-use')) {
        toast.error('Email sudah terdaftar');
      } else {
        toast.error('Gagal mendaftar. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-amber-50/30 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-2xl font-bold font-heading gradient-text">WaqfChain</span>
          </Link>
          <h1 className="text-2xl font-bold font-heading text-gray-900 mb-2">Buat Akun Baru</h1>
          <p className="text-gray-500">Bergabung dan mulai berwakaf digital</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Nama Lengkap" type="text" placeholder="Masukkan nama lengkap" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="Minimal 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={confirmPassword && password !== confirmPassword ? 'Password tidak cocok' : undefined}
            />
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Daftar Sekarang
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-teal-600 font-semibold hover:text-teal-700">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
