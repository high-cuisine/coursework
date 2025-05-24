import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SupplyService {
  constructor(private readonly pool: Pool) {}

  async create(data: any) {
    console.log(data, 'test');
    const query = `
      INSERT INTO Supply (StoreID, ProductID, Quantity, SupplyDate)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await this.pool.query(query, [
      data.storeId,
      data.productId,
      data.quantity,
      data.supplyDate || new Date(),
    ]);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT s.*, st.StoreName, p.ProductName
      FROM Supply s
      JOIN Store st ON s.StoreID = st.StoreID
      JOIN Product p ON s.ProductID = p.ProductID
      ORDER BY s.SupplyDate DESC;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT s.*, st.StoreName, p.ProductName
      FROM Supply s
      JOIN Store st ON s.StoreID = st.StoreID
      JOIN Product p ON s.ProductID = p.ProductID
      WHERE s.SupplyID = $1;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Supply with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async update(id: number, data: { quantity?: number; supplyDate?: Date }) {
    const currentSupply = await this.findOne(id);
    
    const query = `
      UPDATE Supply
      SET 
        Quantity = $1,
        SupplyDate = $2
      WHERE SupplyID = $3
      RETURNING *;
    `;
    
    const result = await this.pool.query(query, [
      data.quantity || currentSupply.quantity,
      data.supplyDate || currentSupply.supplydate,
      id,
    ]);
    
    return result.rows[0];
  }

  async remove(id: number) {
    const query = `
      DELETE FROM Supply
      WHERE SupplyID = $1
      RETURNING *;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Supply with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async getSupplyHistory(storeId: number, startDate: Date, endDate: Date) {
    const query = `
      SELECT s.*, p.ProductName, st.StoreName
      FROM Supply s
      JOIN Product p ON s.ProductID = p.ProductID
      JOIN Store st ON s.StoreID = st.StoreID
      WHERE s.StoreID = $1
        AND s.SupplyDate BETWEEN $2 AND $3
      ORDER BY s.SupplyDate DESC;
    `;
    const result = await this.pool.query(query, [storeId, startDate, endDate]);
    return result.rows;
  }
}
