'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useSavedOpportunities, useSavedIds, useUnsaveOpportunity } from '@/hooks/useSaved';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';

export default function SavedPage() {
  const { user, loading } = useAuth();
  const { data: saved = [], isLoading } = useSavedOpportunities(user?.id);
  const { data: savedIds = [] } = useSavedIds(user?.id);

  if (loading || isLoading) return <PageLoader />;

  const opportunities = saved
    .map((s) => s.opportunities)
    .filter(Boolean) as NonNullable<(typeof saved)[number]['opportunities']>[];

  return (
    <div className="page-container py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-green-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-50">Saved Opportunities</h1>
          </div>
          <p className="text-slate-400 text-sm ml-10.5">
            {opportunities.length} saved {opportunities.length === 1 ? 'opportunity' : 'opportunities'}
          </p>
        </div>

        <Link href="/browse" className="btn-secondary text-sm hidden sm:flex">
          <Compass className="w-4 h-4" />
          Browse more
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-navy-700 border border-navy-600 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="font-display font-semibold text-slate-200 mb-2">Nothing saved yet</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
            Browse opportunities and click the bookmark icon to save them here.
          </p>
          <Link href="/browse" className="btn-primary">
            Explore Opportunities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              savedIds={savedIds}
              userId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
