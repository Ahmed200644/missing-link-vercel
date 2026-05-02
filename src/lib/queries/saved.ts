import { createClient } from '@/lib/supabase/client';
import type { SavedOpportunity } from '@/lib/types';

export async function fetchSavedOpportunities(userId: string): Promise<SavedOpportunity[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('saved_opportunities')
    .select('*, opportunities(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as SavedOpportunity[];
}

export async function fetchSavedIds(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('saved_opportunities')
    .select('opportunity_id')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.opportunity_id);
}

export async function saveOpportunity(
  userId: string,
  opportunityId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('saved_opportunities')
    .insert({ user_id: userId, opportunity_id: opportunityId });
  if (error) throw new Error(error.message);
}

export async function unsaveOpportunity(
  userId: string,
  opportunityId: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('saved_opportunities')
    .delete()
    .eq('user_id', userId)
    .eq('opportunity_id', opportunityId);
  if (error) throw new Error(error.message);
}
