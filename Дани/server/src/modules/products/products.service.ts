import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ProductsService {
  constructor(private readonly pool: Pool) {}

  async create(data: { productname: string; categoryid: number; price: number, description: string}) {
    console.log(data, 'test');
    const query = `
      INSERT INTO Product (ProductName, CategoryID, Price)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await this.pool.query(query, [
      data.productname,
      data.categoryid,
      data.price,
    ]);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT p.*, c.CategoryName
      FROM Product p
      JOIN Category c ON p.CategoryID = c.CategoryID;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT p.*, c.CategoryName
      FROM Product p
      JOIN Category c ON p.CategoryID = c.CategoryID
      WHERE p.ProductID = $1;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async update(id: number, data: { productName?: string; categoryId?: number; price?: number }) {
    const currentProduct = await this.findOne(id);
    
    const query = `
      UPDATE Product
      SET 
        ProductName = $1,
        CategoryID = $2,
        Price = $3
      WHERE ProductID = $4
      RETURNING *;
    `;
    
    const result = await this.pool.query(query, [
      data.productName || currentProduct.productname,
      data.categoryId || currentProduct.categoryid,
      data.price || currentProduct.price,
      id,
    ]);
    
    return result.rows[0];
  }

  async remove(id: number) {
    const query = `
      DELETE FROM Product
      WHERE ProductID = $1
      RETURNING *;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return result.rows[0];
  }
}
