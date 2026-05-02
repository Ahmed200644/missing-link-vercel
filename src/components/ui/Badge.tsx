import { OPPORTUNITY_TYPE_COLORS, OPPORTUNITY_TYPE_LABELS } from '@/lib/types';
import type { ModeType, OpportunityType } from '@/lib/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'blue' | 'amber' | 'rose' | 'purple';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-navy-600 text-slate-300 border-navy-500',
    green:   'bg-green-500/15 text-green-300 border-green-500/30',
    blue:    'bg-blue-500/15 text-blue-300 border-blue-500/30',
    amber:   'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose:    'bg-rose-500/15 text-rose-300 border-rose-500/30',
    purple:  'bg-purple-500/15 text-purple-300 border-purple-500/30',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}

export function OpportunityTypeBadge({ type }: { type: OpportunityType }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border
        ${OPPORTUNITY_TYPE_COLORS[type]}
      `}
    >
      {OPPORTUNITY_TYPE_LABELS[type]}
    </span>
  );
}

export function ModeBadge({ mode }: { mode: ModeType }) {
  const colors: Record<ModeType, string> = {
    online:  'bg-teal-500/15 text-teal-300 border-teal-500/30',
    onsite:  'bg-orange-500/15 text-orange-300 border-orange-500/30',
    hybrid:  'bg-violet-500/15 text-violet-300 border-violet-500/30',
  };
  const labels: Record<ModeType, string> = {
    online: 'Online',
    onsite: 'On-site',
    hybrid: 'Hybrid',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${colors[mode]}`}>
      {labels[mode]}
    </span>
  );
}
