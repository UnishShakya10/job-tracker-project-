import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Application } from '../types';
import { JOB_TYPES, STATUSES } from '../types';

const schema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  job_title: z.string().min(1, 'Job title is required'),
  job_type: z.enum(['Internship', 'Full-time', 'Part-time']),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']),
  applied_date: z.string().min(1, 'Applied date is required'),
  notes: z.string(),
});

export type FormValues = z.infer<typeof schema>;

interface Props {
  initial?: Application;
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ApplicationForm({ initial, onSubmit, onCancel, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          company_name: initial.company_name,
          job_title: initial.job_title,
          job_type: initial.job_type,
          status: initial.status,
          applied_date: initial.applied_date.split('T')[0],
          notes: initial.notes ?? '',
        }
      : {
          status: 'Applied',
          job_type: 'Full-time',
          applied_date: new Date().toISOString().split('T')[0],
          notes: '',
        },
  });

  const handleValid: SubmitHandler<FormValues> = (data) => onSubmit(data);

  return (
    <form onSubmit={handleSubmit(handleValid)} noValidate>
      <div className="form-grid form-grid-2">
        <div className="form-group">
          <label className="label">
            Company Name <span className="req">*</span>
          </label>
          <input
            className={`input ${errors.company_name ? 'error' : ''}`}
            placeholder="e.g. Leapfrog Technology"
            {...register('company_name')}
          />
          {errors.company_name && (
            <span className="field-error">{errors.company_name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="label">
            Job Title <span className="req">*</span>
          </label>
          <input
            className={`input ${errors.job_title ? 'error' : ''}`}
            placeholder="e.g. Software Engineer Intern"
            {...register('job_title')}
          />
          {errors.job_title && (
            <span className="field-error">{errors.job_title.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="label">
            Job Type <span className="req">*</span>
          </label>
          <select className={`select ${errors.job_type ? 'error' : ''}`} {...register('job_type')}>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.job_type && (
            <span className="field-error">{errors.job_type.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="label">
            Status <span className="req">*</span>
          </label>
          <select className={`select ${errors.status ? 'error' : ''}`} {...register('status')}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.status && (
            <span className="field-error">{errors.status.message}</span>
          )}
        </div>

        <div className="form-group">
          <label className="label">
            Applied Date <span className="req">*</span>
          </label>
          <input
            type="date"
            className={`input ${errors.applied_date ? 'error' : ''}`}
            {...register('applied_date')}
          />
          {errors.applied_date && (
            <span className="field-error">{errors.applied_date.message}</span>
          )}
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 16 }}>
        <label className="label">Notes</label>
        <textarea
          className="textarea"
          placeholder="Any additional notes about this application..."
          rows={3}
          {...register('notes')}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving…' : initial ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </form>
  );
}
