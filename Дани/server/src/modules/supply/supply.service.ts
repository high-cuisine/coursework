import { Injectable } from '@nestjs/common';
import { pool } from 'src/core/db';

@Injectable()
export class SupplyService {
    async getTAllSupply() {
        const query = `
            SELECT * FROM Report;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    async getSupplyById(id:number) {
        const query = `
            SELECT * FROM Report WHERE id =${id};
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    async createSupply(store_id:number, month:number, total_revenue:any,) {
        const query = `
            INSERT INTO shop (name, category, selling_price)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [store_id, month, total_revenue]);
        return rows;
    }

    async updateSupply(id:number, store_id:number, month:number, total_revenue:any,) {
        const query = `
            UPDATE shop SET name = $1, category = $2, selling_price = $3 WHERE id = $4 RETURNING *;
        `;
        const { rows } = await pool.query(query, [store_id, month, total_revenue, id]);
        return rows;
    }

    async deleteSupply(id:number) {
        const query = `
            DELETE FROM shop WHERE id = $1;
        `;
        const { rows } = await pool.query(query, [id]);
        return rows;
    }
}
