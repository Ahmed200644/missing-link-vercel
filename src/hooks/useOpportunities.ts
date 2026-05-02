'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchOpportunities,
  fetchOpportunityById,
  fetchAllOpportunitiesAdmin,
  fetchFeaturedOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  toggleOpportunityActive,
} from '@/lib/queries/opportunities';
import type { OpportunityFilters, OpportunityFormData } from '@/lib/types';

// ── Query keys ──────────────────────────────────────────────
export const opportunityKeys = {
  all:      ['opportunities'] as const,
  lists:    () => [...opportunityKeys.all, 'list']  as const,
  filtered: (f: OpportunityFilters) => [...opportunityKeys.lists(), f] as const,
  detail:   (id: string)  => [...opportunityKeys.all, 'detail', id] as const,
  featured: () => [...opportunityKeys.all, 'featured'] as const,
  admin:    () => [...opportunityKeys.all, 'admin'] as const,
};

// ── Read hooks ──────────────────────────────────────────────

export function useOpportunities(filters: OpportunityFilters = {}) {
  return useQuery({
    queryKey:  opportunityKeys.filtered(filters),
    queryFn:   () => fetchOpportunities(filters),
    staleTime: 0,
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey:  opportunityKeys.detail(id),
    queryFn:   () => fetchOpportunityById(id),
    staleTime: 0,
    enabled:   !!id,
  });
}

export function useFeaturedOpportunities() {
  return useQuery({
    queryKey:  opportunityKeys.featured(),
    queryFn:   fetchFeaturedOpportunities,
    staleTime: 0,
  });
}

export function useAdminOpportunities() {
  return useQuery({
    queryKey:  opportunityKeys.admin(),
    queryFn:   fetchAllOpportunitiesAdmin,
    staleTime: 0,
  });
}

// ── Mutation hooks ──────────────────────────────────────────

export function useCreateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, userId }: { data: OpportunityFormData; userId: string }) =>
      createOpportunity(data, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: opportunityKeys.all });
    },
  });
}

export function useUpdateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OpportunityFormData> }) =>
      updateOpportunity(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: opportunityKeys.all });
    },
  });
}

export function useDeleteOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOpportunity(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: opportunityKeys.all });
    },
  });
}

export function useToggleOpportunityActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      toggleOpportunityActive(id, is_active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: opportunityKeys.all });
    },
  });
}
