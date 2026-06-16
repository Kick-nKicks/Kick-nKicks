import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInDemo: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_INIT_TIMEOUT_MS = 8000;

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user',
  email: 'demo@kicknkicks.com',
  displayName: 'Demo Kicker',
  rating: 4.8,
  totalSales: 12,
  memberSince: '2025-01-15',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const finishLoading = () => {
      clearTimeout(timeout);
      if (!cancelled) setLoading(false);
    };

    timeout = setTimeout(finishLoading, AUTH_INIT_TIMEOUT_MS);

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (!cancelled) setSession(s);
      })
      .catch(() => {
        if (!cancelled) setSession(null);
      })
      .finally(finishLoading);

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!cancelled) setSession(s);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (demoMode) {
      setProfile(DEMO_PROFILE);
      return;
    }
    if (!session?.user) {
      setProfile(null);
      return;
    }
    setProfile({
      id: session.user.id,
      email: session.user.email ?? '',
      displayName:
        session.user.user_metadata?.full_name ??
        session.user.email?.split('@')[0] ??
        'Kicker',
      avatarUrl: session.user.user_metadata?.avatar_url,
      rating: 4.5,
      totalSales: 0,
      memberSince: session.user.created_at?.slice(0, 10) ?? '',
    });
  }, [session, demoMode]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    setDemoMode(false);
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const signInDemo = useCallback(() => {
    setDemoMode(true);
    setSession({} as Session);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session: demoMode ? ({} as Session) : session,
      user: session?.user ?? (demoMode ? ({ id: 'demo' } as User) : null),
      profile,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      signInDemo,
    }),
    [session, profile, loading, signInWithEmail, signUpWithEmail, signOut, signInDemo, demoMode],
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
