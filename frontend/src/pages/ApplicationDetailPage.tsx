import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchApplication, updateApplication, deleteApplication } from '../api/applications';
import type { Application } from '../types';
import { type FormValues } from '../components/ApplicationForm';
import StatusBadge from '../components/StatusBadge';
import ApplicationModal from '../components/ApplicationModal';
import DeleteModal from '../components/DeleteModal';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchApplication(id)
      .then(setApp)
      .catch(() => toast.error('Application not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data: FormValues) => {
    if (!app) return;
    setSubmitting(true);
    try {
      const updated = await updateApplication(app.id, data);
      setApp(updated);
      setShowEdit(false);
      toast.success('Application updated!');
    } catch {
      toast.error('Failed to update application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!app) return;
    setSubmitting(true);
    try {
      await deleteApplication(app.id);
      toast.success('Application deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete application');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><div className="loading-center"><div className="spinner" /></div></div>;
  if (!app) return <div className="page"><p>Application not found.</p></div>;

  return (
    <div className="page">
      <Link to="/" className="back-link">
        <ArrowLeft size={15} /> Back to Applications
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">{app.company_name}</h1>
          <p className="page-subtitle">{app.job_title}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowEdit(true)}>
            <Pencil size={15} /> Edit
          </button>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <StatusBadge status={app.status} />
            <span className="job-type-badge">{app.job_type}</span>
          </div>

          <div className="detail-grid">
            <div className="detail-field">
              <label>Company</label>
              <p>{app.company_name}</p>
            </div>
            <div className="detail-field">
              <label>Job Title</label>
              <p>{app.job_title}</p>
            </div>
            <div className="detail-field">
              <label>Applied Date</label>
              <p>{formatDate(app.applied_date)}</p>
            </div>
            <div className="detail-field">
              <label>Status</label>
              <p>{app.status}</p>
            </div>
            <div className="detail-field">
              <label>Added</label>
              <p>{formatDateTime(app.created_at)}</p>
            </div>
            <div className="detail-field">
              <label>Last Updated</label>
              <p>{formatDateTime(app.updated_at)}</p>
            </div>
            {app.notes && (
              <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
                <label>Notes</label>
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>{app.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEdit && (
        <ApplicationModal
          application={app}
          onSubmit={handleUpdate}
          onClose={() => setShowEdit(false)}
          isLoading={submitting}
        />
      )}
      {showDelete && (
        <DeleteModal
          application={app}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          isLoading={submitting}
        />
      )}
    </div>
  );
}
