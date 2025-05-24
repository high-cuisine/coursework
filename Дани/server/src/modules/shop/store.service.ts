import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class StoreService {
  constructor(private readonly pool: Pool) {}

  async create(data: { storeName: string; address: string }) {
    console.log(data, 'test');
    const query = `
      INSERT INTO Store (StoreName, Location)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await this.pool.query(query, [data.storeName, data.address]);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT *
      FROM Store
      ORDER BY StoreID;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT *
      FROM Store
      WHERE StoreID = $1;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async update(id: number, data: { storename?: string; location?: string }) {
    const currentStore = await this.findOne(id);

    console.log(currentStore, id, data);
    
    const query = `
      UPDATE Store
      SET 
        StoreName = $1,
        Location = $2
      WHERE StoreID = $3
      RETURNING *;
    `;
    
    const result = await this.pool.query(query, [
      data.storename,
      data.location || currentStore.location,
      id,
    ]);
    
    return result.rows[0];
  }

  async remove(id: number) {
    const query = `
      DELETE FROM Store
      WHERE StoreID = $1
      RETURNING *;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async getStoreInventory(id: number) {
    const query = `
      SELECT p.ProductID, p.ProductName, p.Price, c.CategoryName,
             COALESCE(
               (SELECT SUM(s.Quantity) 
                FROM Supply s 
                WHERE s.StoreID = $1 AND s.ProductID = p.ProductID), 0
             ) - 
             COALESCE(
               (SELECT SUM(sl.Quantity) 
                FROM Sale sl 
                WHERE sl.StoreID = $1 AND sl.ProductID = p.ProductID), 0
             ) as CurrentStock
      FROM Product p
      JOIN Category c ON p.CategoryID = c.CategoryID
      ORDER BY c.CategoryName, p.ProductName;
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows;
  }

  async addCascadeDelete() {
    const queries = [
      'ALTER TABLE Supply DROP CONSTRAINT IF EXISTS supply_storeid_fkey',
      'ALTER TABLE Sale DROP CONSTRAINT IF EXISTS sale_storeid_fkey',
      'ALTER TABLE Request DROP CONSTRAINT IF EXISTS request_storeid_fkey',
      'ALTER TABLE Report DROP CONSTRAINT IF EXISTS report_store_id_fkey',
      
      'ALTER TABLE Supply ADD CONSTRAINT supply_storeid_fkey FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE',
      'ALTER TABLE Sale ADD CONSTRAINT sale_storeid_fkey FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE',
      'ALTER TABLE Request ADD CONSTRAINT request_storeid_fkey FOREIGN KEY (StoreID) REFERENCES Store(StoreID) ON DELETE CASCADE',
      'ALTER TABLE Report ADD CONSTRAINT report_store_id_fkey FOREIGN KEY (store_id) REFERENCES Store(StoreID) ON DELETE CASCADE'
    ];

    for (const query of queries) {
      await this.pool.query(query);
    }
  }
} 