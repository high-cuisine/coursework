import { Pool } from 'pg';

export const databaseConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'danyadb',
    password: process.env.DB_PASSWORD || 'qwerty',
    port: parseInt(process.env.DB_PORT || '5432'),
};

export const pool = new Pool(databaseConfig); 