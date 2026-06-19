import type { ApplicationStatus } from '../types';
import { STATUS_COLORS } from '../types';

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`badge ${STATUS_COLORS[status]}`}>{status}</span>
  );
}
