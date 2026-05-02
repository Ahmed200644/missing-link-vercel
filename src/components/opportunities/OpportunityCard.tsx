'use client';

import Link from 'next/link';
import { MapPin, Calendar, Building2, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { OpportunityTypeBadge, ModeBadge, Badge } from '@/components/ui/Badge';
import { useSaveOpportunity, useUnsaveOpportunity } from '@/hooks/useSaved';
import type { Opportunity } from '@/lib/types';

interface OpportunityCardProps {
  opportunity:   Opportunity;
  savedIds?:     string[];
  userId?:       string;
  showAdminControls?: boolean;
  onEdit?:       (opp: Opportunity) => void;
  onDelete?:     (id: string) => void;
  onToggleActive?: (id: string, is_active: boolean) => void;
}

export function OpportunityCard({
  opportunity,
  savedIds = [],
  userId,
  showAdminControls = false,
  onEdit,
  onDelete,
  onToggleActive,
}: OpportunityCardProps) {
  const isSaved     = savedIds.includes(opportunity.id);
  const saveMut     = useSaveOpportunity(userId);
  const unsaveMut   = useUnsaveOpportunity(userId);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (isSaved) {
      unsaveMut.mutate(opportunity.id);
    } else {
      saveMut.mutate(opportunity.id);
    }
  };

  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  const isExpired = opportunity.deadline
    ? new Date(opportunity.deadline) < new Date()
    : false;

  return (
    <div
      className={`
        group relative card p-5 hover:border-navy-500 transition-all duration-300
        hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5
        ${opportunity.is_featured ? 'ring-1 ring-green-500/30' : ''}
      `}
    >
      {/* Featured ribbon */}
      {opportunity.is_featured && (
        <div className="absolute top-0 right-4 -translate-y-0 bg-green-500 text-navy-950 text-[10px] font-bold px-2.5 py-0.5 rounded-b-lg tracking-wide">
          FEATURED
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Type + mode badges */}
        <div className="flex flex-wrap gap-1.5">
          <OpportunityTypeBadge type={opportunity.opportunity_type} />
          <ModeBadge mode={opportunity.mode} />
          {opportunity.is_paid && (
            <Badge variant="green">Paid</Badge>
          )}
          {!opportunity.is_active && (
            <Badge>Inactive</Badge>
          )}
        </div>

        {/* Save button */}
        {userId && !showAdminControls && (
          <button
            onClick={handleSaveToggle}
            disabled={saveMut.isPending || unsaveMut.isPending}
            className={`shrink-0 p-1.5 rounded-lg transition-all ${
              isSaved
                ? 'text-green-400 bg-green-500/15'
                : 'text-slate-500 hover:text-green-400 hover:bg-green-500/10'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            {isSaved
              ? <BookmarkCheck className="w-4 h-4" />
              : <Bookmark className="w-4 h-4" />
            }
          </button>
        )}
      </div>

      {/* Title */}
      <Link href={`/opportunity/${opportunity.id}`}>
        <h3 className="font-display font-semibold text-slate-50 text-base leading-snug mb-1 group-hover:text-green-400 transition-colors line-clamp-2">
          {opportunity.title}
        </h3>
      </Link>

      {/* Organization */}
      <div className="flex items-center gap-1.5 mb-3">
        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="text-sm text-slate-400 truncate">
          {opportunity.organization}
          {opportunity.organization_type && (
            <span className="text-slate-600 ml-1">
              · {opportunity.organization_type.charAt(0).toUpperCase() + opportunity.organization_type.slice(1)}
            </span>
          )}
        </span>
      </div>

      {/* Description preview */}
      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
        {opportunity.description}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-navy-600 pt-3">
        {opportunity.country && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {opportunity.country}
          </span>
        )}
        {deadline && (
          <span className={`flex items-center gap-1 ${isExpired ? 'text-rose-400' : ''}`}>
            <Calendar className="w-3.5 h-3.5" />
            {isExpired ? 'Expired' : `Deadline: ${deadline}`}
          </span>
        )}
        {opportunity.field && (
          <span className="text-slate-600">· {opportunity.field}</span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {opportunity.external_link && (
            <a
              href={opportunity.external_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors text-xs font-medium"
            >
              Apply <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Admin controls */}
      {showAdminControls && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-navy-600">
          <button
            onClick={() => onEdit?.(opportunity)}
            className="text-xs px-3 py-1.5 rounded-lg bg-navy-600 text-slate-300 hover:bg-navy-500 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onToggleActive?.(opportunity.id, !opportunity.is_active)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              opportunity.is_active
                ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                : 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
            }`}
          >
            {opportunity.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => onDelete?.(opportunity.id)}
            className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-colors ml-auto"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
