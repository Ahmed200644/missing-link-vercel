'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, GraduationCap, BookOpen, Trophy, Users, Leaf, Zap, Globe, TrendingUp } from 'lucide-react';
import { useFeaturedOpportunities } from '@/hooks/useOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useSavedIds } from '@/hooks/useSaved';
import type { OpportunityType } from '@/lib/types';

const CATEGORIES: { type: OpportunityType; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { type: 'job',         label: 'Jobs',          icon: Briefcase,    color: 'text-blue-400',   bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-500/40' },
  { type: 'internship',  label: 'Internships',   icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 hover:border-purple-500/40' },
  { type: 'training',    label: 'Trainings',     icon: BookOpen,     color: 'text-amber-400',  bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-500/40' },
  { type: 'competition', label: 'Competitions',  icon: Trophy,       color: 'text-rose-400',   bg: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 hover:border-rose-500/40' },
  { type: 'youth_event', label: 'Youth Events',  icon: Users,        color: 'text-green-400',  bg: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/40' },
];

const STATS = [
  { icon: Globe,      label: 'Countries',   value: '20+' },
  { icon: TrendingUp, label: 'Opportunities', value: '500+' },
  { icon: Users,      label: 'Youth Reached', value: '10k+' },
  { icon: Leaf,       label: 'SDG Goals',    value: '17' },
];

export default function HomePage() {
  const { user } = useAuth();
  const { data: featured, isLoading } = useFeaturedOpportunities();
  const { data: savedIds = [] } = useSavedIds(user?.id);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center noise-bg overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/30 to-navy-900" />

        {/* Decorative circles */}
        <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-green-500/5 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#4ADE80 1px, transparent 1px), linear-gradient(90deg, #4ADE80 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="page-container relative z-10 py-20">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-8 animate-fade-in">
              <Zap className="w-4 h-4" />
              Connecting Youth to the World
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-50 leading-[1.05] tracking-tight mb-6 animate-slide-up">
              Your Opportunity{' '}
              <br className="hidden sm:block" />
              is{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Missing.
              </span>
              <br />
              Let&apos;s Find It.
            </h1>

            <p
              className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10 animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Missing Link is your structured discovery platform for jobs, internships,
              trainings, competitions, and events — all aligned with sustainable development
              and youth empowerment.
            </p>

            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/browse" className="btn-primary text-base px-7 py-3.5">
                Explore Opportunities
                <ArrowRight className="w-4 h-4" />
              </Link>
              {!user && (
                <Link href="/signup" className="btn-secondary text-base px-7 py-3.5">
                  Join for Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-12 border-y border-navy-700 bg-navy-800/50">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <div className="font-display font-bold text-2xl text-slate-50">{value}</div>
                <div className="text-xs text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2">Browse by type</p>
              <h2 className="section-title">Every Path Forward</h2>
            </div>
            <Link href="/browse" className="btn-ghost hidden sm:flex">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map(({ type, label, icon: Icon, color, bg }) => (
              <Link
                key={type}
                href={`/browse?opportunity_type=${type}`}
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${bg}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`font-display font-semibold text-sm ${color}`}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Opportunities ───────────────────────────── */}
      <section className="py-20 bg-navy-800/30">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2">Handpicked for you</p>
              <h2 className="section-title">Featured Opportunities</h2>
            </div>
            <Link href="/browse" className="btn-ghost hidden sm:flex">
              Browse all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : featured?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  savedIds={savedIds}
                  userId={user?.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              No featured opportunities yet.
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/browse" className="btn-secondary px-8">
              See All Opportunities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      {!user && (
        <section className="py-20">
          <div className="page-container">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-600 to-navy-700 border border-navy-500 p-10 sm:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-transparent" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-7 h-7 text-green-400" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-50 mb-4">
                  Ready to Close the Gap?
                </h2>
                <p className="text-slate-400 mb-8 text-lg">
                  Join thousands of youth discovering opportunities that align with their ambitions and the world&apos;s needs.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signup" className="btn-primary text-base px-8 py-3.5">
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/browse" className="btn-secondary text-base px-8 py-3.5">
                    Browse First
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
