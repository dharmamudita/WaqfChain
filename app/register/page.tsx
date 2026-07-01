'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signUp } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Rocket } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 py-12 px-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[120px]" />
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-amber-500/15 rounded-full blur-[120px]" />
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
            <h1 className="text-2xl font-extrabold font-heading text-gray-900 mb-2">Buat Akun Baru</h1>
            <p className="text-gray-500 text-sm">Bergabung dan mulai perjalanan wakaf digital Anda</p>
          </div>

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
            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="!py-4 !text-base !shadow-xl !shadow-teal-500/25">
                <span className="flex items-center gap-2 justify-center"><Rocket className="w-5 h-5" /> Daftar Sekarang</span>
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
