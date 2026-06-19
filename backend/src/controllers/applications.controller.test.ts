import request from 'supertest';
import app from '../app';
import * as repo from '../db/applications.repository';
import { Application, PaginatedResponse } from '../types';

jest.mock('../db/applications.repository');

const mockApp: Application = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  company_name: 'Acme Corp',
  job_title: 'Software Engineer',
  job_type: 'Full-time',
  status: 'Applied',
  applied_date: '2024-01-15',
  notes: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockPaginated: PaginatedResponse<Application> = {
  data: [mockApp],
  total: 1,
  page: 1,
  limit: 20,
  totalPages: 1,
};

describe('GET /applications', () => {
  it('returns paginated list', async () => {
    (repo.findAll as jest.Mock).mockResolvedValue(mockPaginated);
    const res = await request(app).get('/applications');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.total).toBe(1);
  });
});

describe('GET /applications/:id', () => {
  it('returns one application', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(mockApp);
    const res = await request(app).get(`/applications/${mockApp.id}`);
    expect(res.status).toBe(200);
    expect(res.body.company_name).toBe('Acme Corp');
  });

  it('returns 404 when not found', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/applications/nonexistent-id');
    expect(res.status).toBe(404);
  });
});

describe('POST /applications', () => {
  it('creates and returns new application', async () => {
    (repo.create as jest.Mock).mockResolvedValue(mockApp);
    const res = await request(app)
      .post('/applications')
      .send({
        company_name: 'Acme Corp',
        job_title: 'Software Engineer',
        job_type: 'Full-time',
        status: 'Applied',
        applied_date: '2024-01-15',
      });
    expect(res.status).toBe(201);
    expect(res.body.company_name).toBe('Acme Corp');
  });

  it('returns 422 for invalid data', async () => {
    const res = await request(app)
      .post('/applications')
      .send({ company_name: 'A' }); // too short, missing fields
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });
});

describe('PATCH /applications/:id', () => {
  it('updates and returns application', async () => {
    const updated = { ...mockApp, status: 'Interviewing' as const };
    (repo.update as jest.Mock).mockResolvedValue(updated);
    const res = await request(app)
      .patch(`/applications/${mockApp.id}`)
      .send({ status: 'Interviewing' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Interviewing');
  });

  it('returns 404 when not found', async () => {
    (repo.update as jest.Mock).mockResolvedValue(null);
    const res = await request(app)
      .patch('/applications/nonexistent-id')
      .send({ status: 'Offer' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /applications/:id', () => {
  it('returns 204 on success', async () => {
    (repo.remove as jest.Mock).mockResolvedValue(true);
    const res = await request(app).delete(`/applications/${mockApp.id}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 when not found', async () => {
    (repo.remove as jest.Mock).mockResolvedValue(false);
    const res = await request(app).delete('/applications/nonexistent-id');
    expect(res.status).toBe(404);
  });
});
