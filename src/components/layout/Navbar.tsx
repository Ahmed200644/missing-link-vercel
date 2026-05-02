'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import {
  Compass, Bookmark, LayoutDashboard, LogOut,
  Menu, X, Zap, ChevronDown, User,
} from 'lucide-react';

export function Navbar() {
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/browse', label: 'Browse', icon: Compass },
    ...(user && !isAdmin ? [{ href: '/saved', label: 'Saved', icon: Bookmark }] : []),
    ...(isAdmin ? [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-navy-700/80 bg-navy-900/90 backdrop-blur-md">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30 group-hover:bg-green-500/25 transition-colors">
              <Zap className="w-4 h-4 text-green-400" />
            </div>
            <span className="font-display font-bold text-lg text-slate-50 tracking-tight">
              Missing<span className="text-green-400">Link</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-green-500/15 text-green-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Auth controls */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-navy-700 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-700 border border-navy-600 hover:border-navy-500 transition-colors text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <span className="text-slate-200 font-medium max-w-[120px] truncate">
                    {profile?.full_name ?? 'User'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-navy-700 border border-navy-600 rounded-xl shadow-xl z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-navy-600">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-medium text-slate-200 truncate">{profile?.full_name}</p>
                        {isAdmin && (
                          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                            Admin
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link href="/signup" className="btn-primary text-sm">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-navy-700 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-navy-700 bg-navy-900">
          <div className="page-container py-4 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-navy-700 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {!user ? (
              <div className="flex gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary justify-center">Sign in</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary justify-center">Get started</Link>
              </div>
            ) : (
              <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
