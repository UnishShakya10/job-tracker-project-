import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../api/applications';
import { type FormValues } from '../components/ApplicationForm';
import type {
  Application,

  ApplicationStatus,
  ListFilters,
} from '../types';
import { STATUSES } from '../types';
import ApplicationModal from '../components/ApplicationModal';
import DeleteModal from '../components/DeleteModal';
import StatusBadge from '../components/StatusBadge';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ListFilters>({ status: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApplications({ ...filters, page });
      setApps(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [filters]);

  const handleCreate = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const created = await createApplication(data);
      setApps((prev) => [created, ...prev]);
      setTotal((t) => t + 1);
      setShowAdd(false);
      toast.success('Application added!');
    } catch {
      toast.error('Failed to add application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: FormValues) => {
    if (!editTarget) return;
    setSubmitting(true);
    try {
      const updated = await updateApplication(editTarget.id, data);
      setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setEditTarget(null);
      toast.success('Application updated!');
    } catch {
      toast.error('Failed to update application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await deleteApplication(deleteTarget.id);
      setApps((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setTotal((t) => t - 1);
      setDeleteTarget(null);
      toast.success('Application deleted');
    } catch {
      toast.error('Failed to delete application');
    } finally {
      setSubmitting(false);
    }
  };

  // Stats by status
  const statusCounts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s).length;
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Applications</h1>
          <p className="page-subtitle">{total} application{total !== 1 ? 's' : ''} tracked</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Application
        </button>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {STATUSES.map((s) => (
          <div key={s} className="stat-card" style={{ cursor: 'pointer' }}
            onClick={() => setFilters((f) => ({ ...f, status: f.status === s ? '' : s }))}>
            <div className="stat-num">{statusCounts[s] ?? 0}</div>
            <div className="stat-label">{s}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-wrap">
          <Search size={15} className="icon" />
          <input
            className="input search-input"
            placeholder="Search company or job title…"
            value={filters.search ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select
          className="select filter-select"
          value={filters.status ?? ''}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value as ApplicationStatus | '' }))
          }
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {(filters.search || filters.status) && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFilters({ status: '', search: '' })}
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrap">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : apps.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={40} strokeWidth={1.2} />
            <h3>No applications found</h3>
            <p>
              {filters.search || filters.status
                ? 'Try adjusting your filters'
                : 'Click "Add Application" to get started'}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Job Title</th>
                <th className="col-type">Type</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id}>
                  <td className="col-company">{app.company_name}</td>
                  <td className="col-title">{app.job_title}</td>
                  <td className="col-type">
                    <span className="job-type-badge">{app.job_type}</span>
                  </td>
                  <td><StatusBadge status={app.status} /></td>
                  <td className="col-date">{formatDate(app.applied_date)}</td>
                  <td>
                    <div className="col-actions">
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="View"
                        onClick={() => navigate(`/applications/${app.id}`)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Edit"
                        onClick={() => setEditTarget(app)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-danger btn-icon btn-sm"
                        title="Delete"
                        onClick={() => setDeleteTarget(app)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <div className="pagination-controls">
              <button
                className="btn btn-ghost btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdd && (
        <ApplicationModal
          onSubmit={handleCreate}
          onClose={() => setShowAdd(false)}
          isLoading={submitting}
        />
      )}
      {editTarget && (
        <ApplicationModal
          application={editTarget}
          onSubmit={handleUpdate}
          onClose={() => setEditTarget(null)}
          isLoading={submitting}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          application={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={submitting}
        />
      )}
    </div>
  );
}
