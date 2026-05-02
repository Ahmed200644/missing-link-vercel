'use client';

import { useState } from 'react';
import type { Opportunity, OpportunityFormData, OpportunityType, OrganizationType, ModeType, JobTimeType } from '@/lib/types';

interface OpportunityFormProps {
  initialData?: Partial<Opportunity>;
  onSubmit:     (data: OpportunityFormData) => Promise<void>;
  onCancel?:    () => void;
  isLoading?:   boolean;
  submitLabel?: string;
}

const EMPTY_FORM: OpportunityFormData = {
  title:             '',
  description:       '',
  opportunity_type:  'job',
  organization_type: 'company',
  field:             '',
  country:           '',
  mode:              'online',
  job_time:          '',
  is_paid:           false,
  organization:      '',
  deadline:          '',
  external_link:     '',
  is_featured:       false,
  is_active:         true,
};

export function OpportunityForm({ initialData, onSubmit, onCancel, isLoading, submitLabel = 'Save' }: OpportunityFormProps) {
  const [form, setForm] = useState<OpportunityFormData>({
    ...EMPTY_FORM,
    ...initialData,
    job_time:  (initialData?.job_time  ?? '') as JobTimeType | '',
    field:     initialData?.field      ?? '',
    country:   initialData?.country    ?? '',
    deadline:  initialData?.deadline   ?? '',
    external_link: initialData?.external_link ?? '',
  });
  const [error, setError] = useState('');

  const set = <K extends keyof OpportunityFormData>(key: K, value: OpportunityFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.description.trim() || !form.organization.trim()) {
      setError('Title, description, and organization are required.');
      return;
    }
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <Field label="Title *">
        <input
          className="input"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Junior Frontend Developer"
        />
      </Field>

      {/* Description */}
      <Field label="Description *">
        <textarea
          className="input min-h-[160px] resize-y"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Full description of the opportunity..."
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Type */}
        <Field label="Opportunity Type *">
          <select className="input" value={form.opportunity_type} onChange={(e) => set('opportunity_type', e.target.value as OpportunityType)}>
            <option value="job">Job</option>
            <option value="internship">Internship</option>
            <option value="training">Training</option>
            <option value="competition">Competition</option>
            <option value="youth_event">Youth Event</option>
          </select>
        </Field>

        {/* Org type */}
        <Field label="Organization Type *">
          <select className="input" value={form.organization_type} onChange={(e) => set('organization_type', e.target.value as OrganizationType)}>
            <option value="company">Company</option>
            <option value="ngo">NGO</option>
            <option value="university">University</option>
            <option value="government">Government</option>
            <option value="startup">Startup</option>
          </select>
        </Field>

        {/* Organization */}
        <Field label="Organization Name *">
          <input className="input" value={form.organization} onChange={(e) => set('organization', e.target.value)} placeholder="e.g. TechNile Solutions" />
        </Field>

        {/* Field */}
        <Field label="Field">
          <input className="input" value={form.field} onChange={(e) => set('field', e.target.value)} placeholder="e.g. Software Development" />
        </Field>

        {/* Country */}
        <Field label="Country">
          <input className="input" value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="e.g. Egypt" />
        </Field>

        {/* Mode */}
        <Field label="Work Mode *">
          <select className="input" value={form.mode} onChange={(e) => set('mode', e.target.value as ModeType)}>
            <option value="online">Online</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </Field>

        {/* Job time — only for job/internship */}
        {(form.opportunity_type === 'job' || form.opportunity_type === 'internship') && (
          <Field label="Job Time">
            <select className="input" value={form.job_time} onChange={(e) => set('job_time', e.target.value as JobTimeType | '')}>
              <option value="">Not specified</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
            </select>
          </Field>
        )}

        {/* Deadline */}
        <Field label="Application Deadline">
          <input type="date" className="input" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
        </Field>

        {/* External link */}
        <Field label="External Application Link">
          <input className="input" value={form.external_link} onChange={(e) => set('external_link', e.target.value)} placeholder="https://..." />
        </Field>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <Toggle label="Paid opportunity" checked={form.is_paid} onChange={(v) => set('is_paid', v)} />
        <Toggle label="Featured" checked={form.is_featured} onChange={(v) => set('is_featured', v)} />
        <Toggle label="Active" checked={form.is_active} onChange={(v) => set('is_active', v)} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full border transition-colors ${
          checked ? 'bg-green-500 border-green-500' : 'bg-navy-600 border-navy-500'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="text-sm text-slate-300">{label}</span>
    </label>
  );
}
