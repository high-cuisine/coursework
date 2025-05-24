import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class RequestService {
  constructor(private readonly pool: Pool) {}

  async create(data: { storeId: number; productId: number; requestedQuantity: number; requestDate?: Date }) {
    const query = `
      INSERT INTO Request (StoreID, ProductID, RequestedQuantity, RequestDate)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await this.pool.query(query, [
      data.storeId,
      data.productId,
      data.requestedQuantity,
      data.requestDate || new Date(),
    ]);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT r.*, st.StoreName, p.ProductName
      FROM Request r
      JOIN Store st ON r.StoreID = st.StoreID
      JOIN Product p ON r.ProductID = p.ProductID
      ORDER BY r.RequestDate DESC;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT r.*, st.StoreName, p.ProductName
      FROM Request r
      JOIN Store st ON r.StoreID = st.StoreID
      JOIN Product p ON r.ProductID = p.ProductID
      WHERE r.RequestID = $1;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async update(id: number, data: { requestedQuantity?: number; requestDate?: Date }) {
    const currentRequest = await this.findOne(id);
    
    const query = `
      UPDATE Request
      SET 
        RequestedQuantity = $1,
        RequestDate = $2
      WHERE RequestID = $3
      RETURNING *;
    `;
    
    const result = await this.pool.query(query, [
      data.requestedQuantity || currentRequest.requestedquantity,
      data.requestDate || currentRequest.requestdate,
      id,
    ]);
    
    return result.rows[0];
  }

  async remove(id: number) {
    const query = `
      DELETE FROM Request
      WHERE RequestID = $1
      RETURNING *;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async getStoreRequests(storeId: number, status?: string) {
    let query = `
      SELECT r.*, p.ProductName, st.StoreName
      FROM Request r
      JOIN Product p ON r.ProductID = p.ProductID
      JOIN Store st ON r.StoreID = st.StoreID
      WHERE r.StoreID = $1
    `;
    
    const params = [storeId];
    
    if (status) {
      query += ` AND r.Status = $2`;
      params.push(Number(status));
    }
    
    query += ` ORDER BY r.RequestDate DESC`;
    const result = await this.pool.query(query, params);
    return result.rows;
  }
} 