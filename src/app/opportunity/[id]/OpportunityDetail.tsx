'use client';

import Link from 'next/link';
import { useOpportunity } from '@/hooks/useOpportunities';
import { useSavedIds, useSaveOpportunity, useUnsaveOpportunity } from '@/hooks/useSaved';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { OpportunityTypeBadge, ModeBadge, Badge } from '@/components/ui/Badge';
import {
  ArrowLeft, MapPin, Calendar, Building2, Globe,
  Bookmark, BookmarkCheck, ExternalLink, Clock, DollarSign,
} from 'lucide-react';
import { ORGANIZATION_TYPE_LABELS } from '@/lib/types';

export function OpportunityDetail({ id }: { id: string }) {
  const { user } = useAuth();
  const { data: opp, isLoading, isError } = useOpportunity(id);
  const { data: savedIds = [] } = useSavedIds(user?.id);
  const saveMut = useSaveOpportunity(user?.id);
  const unsaveMut = useUnsaveOpportunity(user?.id);

  const isSaved = savedIds.includes(id);

  const handleSave = () => {
    if (!user) return;
    isSaved ? unsaveMut.mutate(id) : saveMut.mutate(id);
  };

  // 🛡️ Protection layer (important)
  if (isLoading) return <PageLoader />;
  if (isError || !opp) {
    return (
      <div className="page-container py-20 text-center text-slate-400">
        Opportunity not found.{' '}
        <Link href="/browse" className="text-green-400 underline">
          Browse all
        </Link>
      </div>
    );
  }

  const deadline = opp.deadline
    ? new Date(opp.deadline).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const isExpired = opp.deadline ? new Date(opp.deadline) < new Date() : false;

  const postedDate = new Date(opp.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="page-container py-10">
      <Link href="/browse" className="btn-ghost mb-6 -ml-2 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <article className="lg:col-span-2 space-y-6">
          <div className="card p-7">
            <div className="flex flex-wrap gap-2 mb-4">
              <OpportunityTypeBadge type={opp.opportunity_type} />
              <ModeBadge mode={opp.mode} />
              {opp.is_paid && <Badge variant="green">Paid</Badge>}
              {opp.is_featured && <Badge variant="amber">Featured</Badge>}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 mb-3">
              {opp.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-500" />
                <strong className="text-slate-300">{opp.organization}</strong>
                {' · '}
                {ORGANIZATION_TYPE_LABELS[opp.organization_type]}
              </span>

              {opp.country && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {opp.country}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                Posted {postedDate}
              </span>
            </div>
          </div>

          <div className="card p-7">
            <h2 className="font-display font-semibold text-lg text-slate-100 mb-4">
              About this opportunity
            </h2>

            <div className="space-y-3">
              {(opp?.description?.split('\n') ?? []).map((para, i) =>
                para.trim() ? (
                  <p key={i} className="text-slate-300 leading-relaxed">
                    {para}
                  </p>
                ) : (
                  <br key={i} />
                )
              )}
            </div>
          </div>
        </article>

        {/* RIGHT */}
        <aside className="space-y-4">
          <div className="card p-6 space-y-4">

            {/* FIXED APPLY BUTTON */}
            {opp.external_link ? (
              <a
                href={opp.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center text-sm py-3"
              >
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <p className="text-sm text-slate-500 text-center">
                No external link provided
              </p>
            )}

            {user ? (
              <button
                onClick={handleSave}
                disabled={saveMut.isPending || unsaveMut.isPending}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  isSaved
                    ? 'bg-green-500/15 text-green-300 border-green-500/30'
                    : 'bg-navy-700 text-slate-300 border-navy-600'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Save for later
                  </>
                )}
              </button>
            ) : (
              <Link href="/login" className="btn-secondary w-full justify-center text-sm">
                <Bookmark className="w-4 h-4" />
                Sign in to save
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
