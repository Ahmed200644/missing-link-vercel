'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useSavedIds } from '@/hooks/useSaved';
import { useAuth } from '@/hooks/useAuth';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityFilters } from '@/components/opportunities/OpportunityFilters';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { SlidersHorizontal, X } from 'lucide-react';
import type { OpportunityFilters as Filters, OpportunityType } from '@/lib/types';

export function BrowseContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { data: savedIds = [] } = useSavedIds(user?.id);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search:            '',
    opportunity_type:  (searchParams.get('opportunity_type') as OpportunityType) ?? '',
    organization_type: '',
    mode:              '',
    is_paid:           '',
  });

  // Sync URL param when it changes (e.g. clicking a category from the home page)
  useEffect(() => {
    const type = searchParams.get('opportunity_type') as OpportunityType | null;
    setFilters((f) => ({ ...f, opportunity_type: type ?? '' }));
  }, [searchParams]);

  const { data: opportunities = [], isLoading, isError } = useOpportunities(filters);

  return (
    <div className="page-container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-50 mb-1">Browse Opportunities</h1>
        <p className="text-slate-400 text-sm">
          Discover youth opportunities across Egypt and beyond
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <OpportunityFilters
              filters={filters}
              onChange={setFilters}
              total={opportunities.length}
            />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button */}
          <div className="lg:hidden mb-4 flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="btn-secondary text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            {opportunities.length > 0 && (
              <span className="text-sm text-slate-500">{opportunities.length} results</span>
            )}
          </div>

          {/* Mobile filters drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-navy-800 border-l border-navy-700 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-slate-100">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <OpportunityFilters
                  filters={filters}
                  onChange={(f) => { setFilters(f); setShowMobileFilters(false); }}
                  total={opportunities.length}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {isLoading ? (
            <PageLoader />
          ) : isError ? (
            <div className="text-center py-20 text-rose-400">
              Failed to load opportunities. Please try again.
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-navy-700 border border-navy-600 flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-7 h-7 text-slate-500" />
              </div>
              <h3 className="font-display font-semibold text-slate-200 mb-2">No results found</h3>
              <p className="text-slate-500 text-sm mb-6">Try adjusting your filters</p>
              <button
                onClick={() =>
                  setFilters({ search: '', opportunity_type: '', organization_type: '', mode: '', is_paid: '' })
                }
                className="btn-secondary text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}
