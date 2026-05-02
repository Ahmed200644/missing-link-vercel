'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  useAdminOpportunities,
  useUpdateOpportunity,
  useDeleteOpportunity,
  useToggleOpportunityActive,
} from '@/hooks/useOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityForm } from '@/components/opportunities/OpportunityForm';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { PlusCircle, Search, X } from 'lucide-react';
import type { Opportunity, OpportunityFormData } from '@/lib/types';

export default function ManageOpportunitiesPage() {
  const { data: opportunities = [], isLoading } = useAdminOpportunities();
  const updateMut = useUpdateOpportunity();
  const deleteMut = useDeleteOpportunity();
  const toggleMut = useToggleOpportunityActive();

  const [editing,  setEditing]  = useState<Opportunity | null>(null);
  const [search,   setSearch]   = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = opportunities.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.organization.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = async (data: OpportunityFormData) => {
    if (!editing) return;
    await updateMut.mutateAsync({ id: editing.id, data });
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await deleteMut.mutateAsync(id);
    setDeleting(null);
  };

  const handleToggle = (id: string, is_active: boolean) => {
    toggleMut.mutate({ id, is_active });
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-50 mb-1">Manage Opportunities</h1>
          <p className="text-slate-400 text-sm">{opportunities.length} total</p>
        </div>
        <Link href="/dashboard/add" className="btn-primary text-sm">
          <PlusCircle className="w-4 h-4" />
          Add New
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by title or organization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative z-10 w-full max-w-2xl bg-navy-800 border border-navy-600 rounded-2xl shadow-2xl p-7 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-slate-100">Edit Opportunity</h2>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <OpportunityForm
              initialData={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
              isLoading={updateMut.isPending}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-sm bg-navy-800 border border-navy-600 rounded-2xl p-7 shadow-2xl text-center">
            <h3 className="font-display font-semibold text-slate-100 mb-2">Delete Opportunity?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleting(null)} className="btn-secondary text-sm">Cancel</button>
              <button
                onClick={() => handleDelete(deleting)}
                disabled={deleteMut.isPending}
                className="btn-danger"
              >
                {deleteMut.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          {search ? 'No results for that search.' : 'No opportunities yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              showAdminControls
              onEdit={setEditing}
              onDelete={(id) => setDeleting(id)}
              onToggleActive={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
