export type JobType = 'Internship' | 'Full-time' | 'Part-time';
export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationFormData {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListFilters {
  status?: ApplicationStatus | '';
  search?: string;
  page?: number;
}

export const JOB_TYPES: JobType[] = ['Internship', 'Full-time', 'Part-time'];
export const STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: 'status-applied',
  Interviewing: 'status-interviewing',
  Offer: 'status-offer',
  Rejected: 'status-rejected',
};
