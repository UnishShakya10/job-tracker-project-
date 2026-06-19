import { X, Trash2 } from 'lucide-react';
import type { Application } from '../types';

interface Props {
  application: Application;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteModal({ application, onConfirm, onCancel, isLoading }: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Delete Application</h2>
          <button className="btn btn-ghost btn-icon" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            Are you sure you want to delete your application to{' '}
            <strong style={{ color: 'var(--text)' }}>{application.company_name}</strong> for the{' '}
            <strong style={{ color: 'var(--text)' }}>{application.job_title}</strong> role?
            This action cannot be undone.
          </p>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={onCancel} disabled={isLoading}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading}>
              <Trash2 size={15} />
              {isLoading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
