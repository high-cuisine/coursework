"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'danyadb',
    password: 'qwerty',
    port: 5432,
});
exports.pool = pool;
//# sourceMappingURL=db.js.map