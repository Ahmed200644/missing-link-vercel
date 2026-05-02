'use client';

import Link from 'next/link';
import { useAdminOpportunities } from '@/hooks/useOpportunities';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { PlusCircle, ListChecks, Eye, EyeOff, Star, BarChart3, ArrowRight } from 'lucide-react';
import type { OpportunityType } from '@/lib/types';
import { OPPORTUNITY_TYPE_LABELS } from '@/lib/types';

export default function DashboardPage() {
  const { data: opportunities = [], isLoading } = useAdminOpportunities();

  if (isLoading) return <PageLoader />;

  const total    = opportunities.length;
  const active   = opportunities.filter((o) => o.is_active).length;
  const inactive = opportunities.filter((o) => !o.is_active).length;
  const featured = opportunities.filter((o) => o.is_featured).length;

  // Count by type
  const byType = opportunities.reduce<Record<string, number>>((acc, o) => {
    acc[o.opportunity_type] = (acc[o.opportunity_type] ?? 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: 'Total',    value: total,    icon: BarChart3, color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Active',   value: active,   icon: Eye,       color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Inactive', value: inactive, icon: EyeOff,    color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Featured', value: featured, icon: Star,      color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-50 mb-1">Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage all Missing Link opportunities</p>
        </div>
        <Link href="/dashboard/add" className="btn-primary text-sm">
          <PlusCircle className="w-4 h-4" />
          Add Opportunity
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card p-5 border ${bg}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`font-display text-3xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* By type breakdown */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-slate-100 mb-5">Opportunities by Type</h2>
        <div className="space-y-3">
          {(Object.entries(byType) as [OpportunityType, number][]).map(([type, count]) => {
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300">{OPPORTUNITY_TYPE_LABELS[type]}</span>
                  <span className="text-sm font-semibold text-slate-200">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-navy-600 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {Object.keys(byType).length === 0 && (
            <p className="text-slate-500 text-sm">No opportunities yet.</p>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/manage" className="card p-6 hover:border-navy-500 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-navy-600 border border-navy-500 flex items-center justify-center group-hover:border-green-500/40 transition-colors">
              <ListChecks className="w-4 h-4 text-slate-400 group-hover:text-green-400 transition-colors" />
            </div>
            <span className="font-display font-semibold text-slate-200">Manage Opportunities</span>
          </div>
          <p className="text-sm text-slate-500 mb-3">Edit, deactivate, or delete opportunities</p>
          <span className="text-xs text-green-400 flex items-center gap-1">
            Go to manage <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link href="/dashboard/add" className="card p-6 hover:border-green-500/30 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:border-green-500/50 transition-colors">
              <PlusCircle className="w-4 h-4 text-green-400" />
            </div>
            <span className="font-display font-semibold text-slate-200">Add New Opportunity</span>
          </div>
          <p className="text-sm text-slate-500 mb-3">Create and publish a new opportunity</p>
          <span className="text-xs text-green-400 flex items-center gap-1">
            Create now <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}
