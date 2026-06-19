import pool from './pool';
import {
  Application,
  CreateApplicationDto,
  UpdateApplicationDto,
  ListQuery,
  PaginatedResponse,
} from '../types';

export async function findAll(query: ListQuery): Promise<PaginatedResponse<Application>> {
  const { status, search, page = 1, limit = 20 } = query;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (status) {
    conditions.push(`status = $${idx++}::status_enum`);
    values.push(status);
  }

  if (search) {
    conditions.push(
      `(company_name ILIKE $${idx} OR job_title ILIKE $${idx})`
    );
    values.push(`%${search}%`);
    idx++;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM applications ${where}`,
    values
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const dataResult = await pool.query<Application>(
    `SELECT * FROM applications ${where}
     ORDER BY applied_date DESC, created_at DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );

  return {
    data: dataResult.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function findById(id: string): Promise<Application | null> {
  const result = await pool.query<Application>(
    'SELECT * FROM applications WHERE id = $1',
    [id]
  );
  return result.rows[0] ?? null;
}

export async function create(dto: CreateApplicationDto): Promise<Application> {
  const result = await pool.query<Application>(
    `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes)
     VALUES ($1, $2, $3::job_type_enum, $4::status_enum, $5, $6)
     RETURNING *`,
    [dto.company_name, dto.job_title, dto.job_type, dto.status, dto.applied_date, dto.notes ?? null]
  );
  return result.rows[0];
}

export async function update(id: string, dto: UpdateApplicationDto): Promise<Application | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (dto.company_name !== undefined) {
    fields.push(`company_name = $${idx++}`);
    values.push(dto.company_name);
  }
  if (dto.job_title !== undefined) {
    fields.push(`job_title = $${idx++}`);
    values.push(dto.job_title);
  }
  if (dto.job_type !== undefined) {
    fields.push(`job_type = $${idx++}::job_type_enum`);
    values.push(dto.job_type);
  }
  if (dto.status !== undefined) {
    fields.push(`status = $${idx++}::status_enum`);
    values.push(dto.status);
  }
  if (dto.applied_date !== undefined) {
    fields.push(`applied_date = $${idx++}`);
    values.push(dto.applied_date);
  }
  if ('notes' in dto) {
    fields.push(`notes = $${idx++}`);
    values.push(dto.notes ?? null);
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  const result = await pool.query<Application>(
    `UPDATE applications SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0] ?? null;
}

export async function remove(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM applications WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
