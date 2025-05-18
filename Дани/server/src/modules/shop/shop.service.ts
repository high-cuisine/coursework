import { Injectable } from '@nestjs/common';
import { pool } from 'src/core/db';

@Injectable()
export class ShopService {
    async getAll() {
        const query = `
            SELECT * FROM Store;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    async getById(id:number) {
        const query = `
            SELECT * FROM Store;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    async createShop(name:string, address:string, phone:string, email:string) {
        const query = `
            INSERT INTO Store (name, address, phone, email)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [name, address, phone, email]);
        return rows[0];
    }
}
