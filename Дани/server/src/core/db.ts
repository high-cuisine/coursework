import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'danyadb',
  password: 'qwerty',
  port: 5432,
});

export { pool }