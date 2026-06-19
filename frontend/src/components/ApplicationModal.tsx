import { X } from 'lucide-react';
import type { Application } from '../types';
import ApplicationForm, { type FormValues } from './ApplicationForm';

interface Props {
  application?: Application;
  onSubmit: (data: FormValues) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ApplicationModal({ application, onSubmit, onClose, isLoading }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {application ? 'Edit Application' : 'Add Application'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <ApplicationForm
            initial={application}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
