// ============================================================
// Missing Link — Shared Types
// ============================================================

export type UserRole         = 'user' | 'admin';
export type OpportunityType  = 'job' | 'internship' | 'training' | 'competition' | 'youth_event';
export type OrganizationType = 'company' | 'ngo' | 'university' | 'government' | 'startup';
export type ModeType         = 'online' | 'onsite' | 'hybrid';
export type JobTimeType      = 'part-time' | 'full-time';

// ── Supabase row types ──────────────────────────────────────

export interface Profile {
  id:         string;
  full_name:  string;
  role:       UserRole;
  created_at: string;
}

export interface Opportunity {
  id:                string;
  title:             string;
  description:       string;
  opportunity_type:  OpportunityType;
  organization_type: OrganizationType;
  field:             string | null;
  country:           string | null;
  mode:              ModeType;
  job_time:          JobTimeType | null;
  is_paid:           boolean;
  organization:      string;
  deadline:          string | null;
  external_link:     string | null;
  is_featured:       boolean;
  is_active:         boolean;
  created_by:        string | null;
  created_at:        string;
  updated_at:        string;
}

export interface SavedOpportunity {
  id:             string;
  user_id:        string;
  opportunity_id: string;
  created_at:     string;
  opportunities?: Opportunity; // joined
}

// ── Form / filter types ─────────────────────────────────────

export interface OpportunityFilters {
  opportunity_type?: OpportunityType | '';
  organization_type?: OrganizationType | '';
  mode?: ModeType | '';
  country?: string;
  field?: string;
  is_paid?: boolean | '';
  search?: string;
}

export interface OpportunityFormData {
  title:             string;
  description:       string;
  opportunity_type:  OpportunityType;
  organization_type: OrganizationType;
  field:             string;
  country:           string;
  mode:              ModeType;
  job_time:          JobTimeType | '';
  is_paid:           boolean;
  organization:      string;
  deadline:          string;
  external_link:     string;
  is_featured:       boolean;
  is_active:         boolean;
}

// ── Label maps ──────────────────────────────────────────────

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  job:          'Job',
  internship:   'Internship',
  training:     'Training',
  competition:  'Competition',
  youth_event:  'Youth Event',
};

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  company:    'Company',
  ngo:        'NGO',
  university: 'University',
  government: 'Government',
  startup:    'Startup',
};

export const MODE_LABELS: Record<ModeType, string> = {
  online:  'Online',
  onsite:  'On-site',
  hybrid:  'Hybrid',
};

export const OPPORTUNITY_TYPE_COLORS: Record<OpportunityType, string> = {
  job:          'bg-blue-500/15 text-blue-300 border-blue-500/30',
  internship:   'bg-purple-500/15 text-purple-300 border-purple-500/30',
  training:     'bg-amber-500/15 text-amber-300 border-amber-500/30',
  competition:  'bg-rose-500/15 text-rose-300 border-rose-500/30',
  youth_event:  'bg-green-500/15 text-green-300 border-green-500/30',
};
