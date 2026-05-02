'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListChecks, PlusCircle, Zap } from 'lucide-react';

const NAV = [
  { href: '/dashboard',         label: 'Overview',        icon: LayoutDashboard, exact: true },
  { href: '/dashboard/manage',  label: 'Manage',          icon: ListChecks,      exact: false },
  { href: '/dashboard/add',     label: 'Add Opportunity', icon: PlusCircle,      exact: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="page-container py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6 px-2">
                <div className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="font-display font-semibold text-sm text-slate-200">Admin Panel</span>
              </div>

              <nav className="space-y-1">
                {NAV.map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-navy-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
