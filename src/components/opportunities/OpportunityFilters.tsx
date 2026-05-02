'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { OpportunityFilters, OpportunityType, OrganizationType, ModeType } from '@/lib/types';

interface OpportunityFiltersProps {
  filters:    OpportunityFilters;
  onChange:   (filters: OpportunityFilters) => void;
  total?:     number;
}

const OPPORTUNITY_TYPES: { value: OpportunityType; label: string }[] = [
  { value: 'job',         label: 'Jobs' },
  { value: 'internship',  label: 'Internships' },
  { value: 'training',    label: 'Trainings' },
  { value: 'competition', label: 'Competitions' },
  { value: 'youth_event', label: 'Youth Events' },
];

const ORG_TYPES: { value: OrganizationType; label: string }[] = [
  { value: 'company',    label: 'Company' },
  { value: 'ngo',        label: 'NGO' },
  { value: 'university', label: 'University' },
  { value: 'government', label: 'Government' },
  { value: 'startup',    label: 'Startup' },
];

const MODES: { value: ModeType; label: string }[] = [
  { value: 'online',  label: 'Online' },
  { value: 'onsite',  label: 'On-site' },
  { value: 'hybrid',  label: 'Hybrid' },
];

export function OpportunityFilters({ filters, onChange, total }: OpportunityFiltersProps) {
  const setFilter = <K extends keyof OpportunityFilters>(key: K, value: OpportunityFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAll = () =>
    onChange({ search: '', opportunity_type: '', organization_type: '', mode: '', is_paid: '' });

  const hasActiveFilters =
    filters.opportunity_type || filters.organization_type ||
    filters.mode || filters.is_paid !== '';

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search opportunities..."
          value={filters.search ?? ''}
          onChange={(e) => setFilter('search', e.target.value)}
          className="input pl-9"
        />
        {filters.search && (
          <button
            onClick={() => setFilter('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter panel */}
      <div className="card p-4 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <SlidersHorizontal className="w-4 h-4 text-green-400" />
            Filters
            {total !== undefined && (
              <span className="text-slate-500 font-normal">({total} results)</span>
            )}
          </div>
          {hasActiveFilters && (
            <button onClick={clearAll} className="text-xs text-green-400 hover:text-green-300 transition-colors">
              Clear all
            </button>
          )}
        </div>

        {/* Type */}
        <FilterSection title="Opportunity Type">
          <div className="flex flex-wrap gap-1.5">
            {OPPORTUNITY_TYPES.map(({ value, label }) => (
              <FilterChip
                key={value}
                label={label}
                active={filters.opportunity_type === value}
                onClick={() => setFilter('opportunity_type', filters.opportunity_type === value ? '' : value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Organization */}
        <FilterSection title="Organization">
          <div className="flex flex-wrap gap-1.5">
            {ORG_TYPES.map(({ value, label }) => (
              <FilterChip
                key={value}
                label={label}
                active={filters.organization_type === value}
                onClick={() => setFilter('organization_type', filters.organization_type === value ? '' : value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Mode */}
        <FilterSection title="Work Mode">
          <div className="flex flex-wrap gap-1.5">
            {MODES.map(({ value, label }) => (
              <FilterChip
                key={value}
                label={label}
                active={filters.mode === value}
                onClick={() => setFilter('mode', filters.mode === value ? '' : value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Compensation */}
        <FilterSection title="Compensation">
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              label="Paid"
              active={filters.is_paid === true}
              onClick={() => setFilter('is_paid', filters.is_paid === true ? '' : true)}
            />
            <FilterChip
              label="Unpaid / Free"
              active={filters.is_paid === false}
              onClick={() => setFilter('is_paid', filters.is_paid === false ? '' : false)}
            />
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        active
          ? 'bg-green-500/20 text-green-300 border-green-500/40'
          : 'bg-navy-800 text-slate-400 border-navy-600 hover:border-navy-500 hover:text-slate-300'
      }`}
    >
      {label}
    </button>
  );
}
