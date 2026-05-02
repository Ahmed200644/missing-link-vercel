import { createClient } from '@/lib/supabase/client';
import type { Opportunity, OpportunityFilters, OpportunityFormData } from '@/lib/types';

// ── Fetch helpers ───────────────────────────────────────────

export async function fetchOpportunities(
  filters: OpportunityFilters = {}
): Promise<Opportunity[]> {
  const supabase = createClient();

  let query = supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organization.ilike.%${filters.search}%`
    );
  }
  if (filters.opportunity_type) {
    query = query.eq('opportunity_type', filters.opportunity_type);
  }
  if (filters.organization_type) {
    query = query.eq('organization_type', filters.organization_type);
  }
  if (filters.mode) {
    query = query.eq('mode', filters.mode);
  }
  if (filters.country) {
    query = query.ilike('country', `%${filters.country}%`);
  }
  if (filters.is_paid !== '' && filters.is_paid !== undefined) {
    query = query.eq('is_paid', filters.is_paid);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchOpportunityById(id: string): Promise<Opportunity> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchAllOpportunitiesAdmin(): Promise<Opportunity[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchFeaturedOpportunities(): Promise<Opportunity[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ── Mutation helpers ────────────────────────────────────────

export async function createOpportunity(
  formData: OpportunityFormData,
  userId: string
): Promise<Opportunity> {
  const supabase = createClient();

  const payload = {
    ...formData,
    job_time: formData.job_time || null,
    field: formData.field || null,
    country: formData.country || null,
    deadline: formData.deadline || null,
    external_link: formData.external_link || null,
    created_by: userId,
  };

  const { data, error } = await supabase
    .from('opportunities')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateOpportunity(
  id: string,
  formData: Partial<OpportunityFormData>
): Promise<Opportunity> {
  const supabase = createClient();

  const payload = {
    ...formData,
    job_time: formData.job_time === '' ? null : formData.job_time,
  };

  const { data, error } = await supabase
    .from('opportunities')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteOpportunity(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('opportunities').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function toggleOpportunityActive(
  id: string,
  is_active: boolean
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('opportunities')
    .update({ is_active })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
