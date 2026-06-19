import axios from 'axios';
import type { Application, ApplicationFormData, ListFilters, PaginatedResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchApplications(
  filters: ListFilters = {}
): Promise<PaginatedResponse<Application>> {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', String(filters.page));
  const { data } = await api.get<PaginatedResponse<Application>>(
    `/applications?${params.toString()}`
  );
  return data;
}

export async function fetchApplication(id: string): Promise<Application> {
  const { data } = await api.get<Application>(`/applications/${id}`);
  return data;
}

export async function createApplication(form: ApplicationFormData): Promise<Application> {
  const { data } = await api.post<Application>('/applications', form);
  return data;
}

export async function updateApplication(
  id: string,
  form: Partial<ApplicationFormData>
): Promise<Application> {
  const { data } = await api.patch<Application>(`/applications/${id}`, form);
  return data;
}

export async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/applications/${id}`);
}

export default api;
