import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CategoryService {
  constructor(private readonly pool: Pool) {}

  async create(data: { categoryName: any }) {
    console.log(data);
    const query = `
      INSERT INTO Category (CategoryName)
      VALUES ($1)
      RETURNING *;
    `;
    const result = await this.pool.query(query, [data.categoryName.categoryName]);
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT c.*,
             COUNT(p.ProductID) as ProductCount
      FROM Category c
      LEFT JOIN Product p ON c.CategoryID = p.CategoryID
      GROUP BY c.CategoryID
      ORDER BY c.CategoryName;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT c.*,
             COUNT(p.ProductID) as ProductCount
      FROM Category c
      LEFT JOIN Product p ON c.CategoryID = p.CategoryID
      WHERE c.CategoryID = $1
      GROUP BY c.CategoryID;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async update(id: number, data: { categoryName: string }) {
    console.log(data, id);
    const query = `
      UPDATE Category
      SET CategoryName = $1
      WHERE CategoryID = $2
      RETURNING *;
    `;
    
    const result = await this.pool.query(query, [data.categoryName, id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async remove(id: number) {
    // First check if category has any products
    const checkQuery = `
      SELECT COUNT(*) as count
      FROM Product
      WHERE CategoryID = $1;
    `;
    const checkResult = await this.pool.query(checkQuery, [id]);
    
    if (checkResult.rows[0].count > 0) {
      throw new Error('Cannot delete category that has products');
    }

    const query = `
      DELETE FROM Category
      WHERE CategoryID = $1
      RETURNING *;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async getProductsByCategory(id: number) {
    const query = `
      SELECT p.*
      FROM Product p
      WHERE p.CategoryID = $1
      ORDER BY p.ProductName;
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows;
  }
} 