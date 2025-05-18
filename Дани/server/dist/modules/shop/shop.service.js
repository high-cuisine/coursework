"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("../../core/db");
let ShopService = class ShopService {
    async getAll() {
        const query = `
            SELECT * FROM Store;
        `;
        const { rows } = await db_1.pool.query(query);
        return rows;
    }
    async getById(id) {
        const query = `
            SELECT * FROM Store;
        `;
        const { rows } = await db_1.pool.query(query);
        return rows;
    }
    async createShop(name, address, phone, email) {
        const query = `
            INSERT INTO Store (name, address, phone, email)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const { rows } = await db_1.pool.query(query, [name, address, phone, email]);
        return rows[0];
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)()
], ShopService);
//# sourceMappingURL=shop.service.js.map