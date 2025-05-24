"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databasePool = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
exports.databasePool = new pg_1.Pool({
    user: config_1.config.database.user,
    host: config_1.config.database.host,
    database: config_1.config.database.name,
    password: config_1.config.database.password,
    port: config_1.config.database.port,
});
//# sourceMappingURL=database.config.js.map