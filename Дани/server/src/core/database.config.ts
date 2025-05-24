import { Pool } from 'pg';
import { config } from './config';

export const databasePool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.name,
  password: config.database.password,
  port: config.database.port,
}); 