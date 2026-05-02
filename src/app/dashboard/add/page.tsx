'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCreateOpportunity } from '@/hooks/useOpportunities';
import { OpportunityForm } from '@/components/opportunities/OpportunityForm';
import type { OpportunityFormData } from '@/lib/types';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function AddOpportunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createMut = useCreateOpportunity();

  const handleSubmit = async (data: OpportunityFormData) => {
    if (!user) throw new Error('Not authenticated');
    await createMut.mutateAsync({ data, userId: user.id });
    router.push('/dashboard/manage');
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="btn-ghost mb-4 -ml-2 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-center">
            <PlusCircle className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-50">Add Opportunity</h1>
            <p className="text-slate-400 text-xs">Create a new opportunity for youth</p>
          </div>
        </div>
      </div>

      <div className="card p-7">
        <OpportunityForm
          onSubmit={handleSubmit}
          isLoading={createMut.isPending}
          submitLabel="Publish Opportunity"
          onCancel={() => router.push('/dashboard/manage')}
        />
      </div>
    </div>
  );
}
