'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSavedOpportunities,
  fetchSavedIds,
  saveOpportunity,
  unsaveOpportunity,
} from '@/lib/queries/saved';

export const savedKeys = {
  all:  (userId: string) => ['saved', userId] as const,
  ids:  (userId: string) => ['saved', userId, 'ids'] as const,
};

export function useSavedOpportunities(userId: string | undefined) {
  return useQuery({
    queryKey:  savedKeys.all(userId ?? ''),
    queryFn:   () => fetchSavedOpportunities(userId!),
    enabled:   !!userId,
    staleTime: 0,
  });
}

export function useSavedIds(userId: string | undefined) {
  return useQuery({
    queryKey:  savedKeys.ids(userId ?? ''),
    queryFn:   () => fetchSavedIds(userId!),
    enabled:   !!userId,
    staleTime: 0,
  });
}

export function useSaveOpportunity(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (opportunityId: string) =>
      saveOpportunity(userId!, opportunityId),
    onSuccess: () => {
      if (userId) {
        qc.invalidateQueries({ queryKey: savedKeys.all(userId) });
        qc.invalidateQueries({ queryKey: savedKeys.ids(userId) });
      }
    },
  });
}

export function useUnsaveOpportunity(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (opportunityId: string) =>
      unsaveOpportunity(userId!, opportunityId),
    onSuccess: () => {
      if (userId) {
        qc.invalidateQueries({ queryKey: savedKeys.all(userId) });
        qc.invalidateQueries({ queryKey: savedKeys.ids(userId) });
      }
    },
  });
}
