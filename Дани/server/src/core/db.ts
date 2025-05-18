import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sports_store_network',
  password: 'qwerty',
  port: 5432,
});

export { pool }