import pool from './pool';

const createMigrationsTable = `
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

const migrations: Array<{ name: string; sql: string }> = [
  {
    name: '001_create_applications_table',
    sql: `
      CREATE TYPE job_type_enum AS ENUM ('Internship', 'Full-time', 'Part-time');
      CREATE TYPE status_enum AS ENUM ('Applied', 'Interviewing', 'Offer', 'Rejected');

      CREATE TABLE IF NOT EXISTS applications (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name VARCHAR(255) NOT NULL,
        job_title    VARCHAR(255) NOT NULL,
        job_type     job_type_enum NOT NULL,
        status       status_enum NOT NULL DEFAULT 'Applied',
        applied_date DATE NOT NULL,
        notes        TEXT,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications(applied_date DESC);
      CREATE INDEX IF NOT EXISTS idx_applications_company_name ON applications USING GIN(to_tsvector('english', company_name));
    `,
  },
  {
    name: '002_add_updated_at_trigger',
    sql: `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS set_updated_at ON applications;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON applications
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `,
  },
];

async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(createMigrationsTable);

    for (const migration of migrations) {
      const { rows } = await client.query(
        'SELECT id FROM migrations WHERE name = $1',
        [migration.name]
      );

      if (rows.length === 0) {
        console.log(`Running migration: ${migration.name}`);
        await client.query(migration.sql);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [migration.name]);
        console.log(`✓ Migration complete: ${migration.name}`);
      } else {
        console.log(`Skipping (already run): ${migration.name}`);
      }
    }

    await client.query('COMMIT');
    console.log('All migrations complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
