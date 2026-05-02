'use client';

import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import { useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';

interface UseAuthReturn {
  user:     User | null;
  profile:  Profile | null;
  loading:  boolean;
  isAdmin:  boolean;
  signOut:  () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  return {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    signOut,
  };
}
