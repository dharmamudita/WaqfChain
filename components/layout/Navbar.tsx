'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/dashboard', label: 'Transparansi' },
  { href: '/edukasi', label: 'Edukasi' },
  { href: '/peta', label: 'Peta' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, isAdmin, isAuthenticated, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      // Clear cookies
      document.cookie = 'auth-token=; path=/; max-age=0';
      document.cookie = 'user-role=; path=/; max-age=0';
      await signOut();
      toast.success('Berhasil keluar');
      router.push('/');
    } catch {
      toast.error('Gagal keluar');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-xl font-bold font-heading bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent">
              WaqfChain
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-teal-700 bg-teal-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {userData?.name || 'Pengguna'}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-slideUp">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900">{userData?.name}</p>
                        <p className="text-xs text-gray-500">{userData?.email}</p>
                      </div>
                      <Link
                        href="/akun"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Akun Saya
                      </Link>
                      <Link
                        href="/chat"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Chat
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-teal-700 hover:bg-teal-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Panel Admin
                        </Link>
                      )}
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Keluar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Masuk</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Daftar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-slideUp">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link href="/akun" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Akun Saya
                  </Link>
                  <Link href="/chat" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Chat
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-teal-700 hover:bg-teal-50">
                      Panel Admin
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 px-4">
              {isAuthenticated ? (
                <Button variant="danger" size="sm" fullWidth onClick={handleSignOut}>
                  Keluar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" fullWidth>Masuk</Button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" size="sm" fullWidth>Daftar</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
