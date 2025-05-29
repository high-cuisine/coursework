"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.databaseConfig = void 0;
const pg_1 = require("pg");
exports.databaseConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'danyadb',
    password: process.env.DB_PASSWORD || 'qwerty',
    port: parseInt(process.env.DB_PORT || '5432'),
};
exports.pool = new pg_1.Pool(exports.databaseConfig);
//# sourceMappingURL=database.config.js.map