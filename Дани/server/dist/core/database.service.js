"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let DatabaseService = class DatabaseService {
    constructor() {
        this.pool = new pg_1.Pool({
            user: process.env.POSTGRES_USER || 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            database: process.env.POSTGRES_DB || 'store_db',
            password: process.env.POSTGRES_PASSWORD || 'postgres',
            port: parseInt(process.env.POSTGRES_PORT || '5432'),
        });
    }
    async onModuleInit() {
        try {
            const client = await this.pool.connect();
            console.log('[Database] Successfully connected to PostgreSQL');
            client.release();
        }
        catch (error) {
            console.error('[Database] Connection error:', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        await this.pool.end();
        console.log('[Database] Connection pool closed');
    }
    async query(text, params) {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;
            console.log('[Database] Query executed', {
                text,
                duration: `${duration}ms`,
                rows: result.rowCount,
            });
            return result;
        }
        catch (error) {
            console.error('[Database] Query error:', {
                text,
                error: error.message,
                params,
            });
            throw error;
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
//# sourceMappingURL=database.service.js.map