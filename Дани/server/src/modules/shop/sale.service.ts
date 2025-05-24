import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SaleService {
  constructor(private readonly pool: Pool) {}

  async create(data: { storeId: number; productId: number; quantity: number; saleDate?: Date }) {
    // First check if there's enough stock
    const stockQuery = `
      SELECT 
        COALESCE(
          (SELECT SUM(s.Quantity) 
           FROM Supply s 
           WHERE s.StoreID = $1 AND s.ProductID = $2), 0
        ) - 
        COALESCE(
          (SELECT SUM(sl.Quantity) 
           FROM Sale sl 
           WHERE sl.StoreID = $1 AND sl.ProductID = $2), 0
        ) as CurrentStock,
        p.Price
      FROM Product p
      WHERE p.ProductID = $2;
    `;
    
    const stockResult = await this.pool.query(stockQuery, [data.storeId, data.productId]);
    
    if (stockResult.rows[0].currentstock < data.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const totalAmount = stockResult.rows[0].price * data.quantity;

    const query = `
      INSERT INTO Sale (StoreID, ProductID, Quantity, SaleDate, TotalAmount)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    const result = await this.pool.query(query, [
      data.storeId,
      data.productId,
      data.quantity,
      data.saleDate || new Date(),
      totalAmount,
    ]);
    
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT s.*, st.StoreName, p.ProductName
      FROM Sale s
      JOIN Store st ON s.StoreID = st.StoreID
      JOIN Product p ON s.ProductID = p.ProductID
      ORDER BY s.SaleDate DESC;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT s.*, st.StoreName, p.ProductName
      FROM Sale s
      JOIN Store st ON s.StoreID = st.StoreID
      JOIN Product p ON s.ProductID = p.ProductID
      WHERE s.SaleID = $1;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async update(id: number, data: { quantity?: number; saleDate?: Date }) {
    const currentSale = await this.findOne(id);
    
    if (data.quantity) {
      // Check stock if quantity is being updated
      const stockQuery = `
        SELECT 
          COALESCE(
            (SELECT SUM(s.Quantity) 
             FROM Supply s 
             WHERE s.StoreID = $1 AND s.ProductID = $2), 0
          ) - 
          COALESCE(
            (SELECT SUM(sl.Quantity) 
             FROM Sale sl 
             WHERE sl.StoreID = $1 AND sl.ProductID = $2 AND sl.SaleID != $3), 0
          ) as CurrentStock,
          p.Price
        FROM Product p
        WHERE p.ProductID = $2;
      `;
      
      const stockResult = await this.pool.query(stockQuery, [
        currentSale.storeid,
        currentSale.productid,
        id,
      ]);
      
      if (stockResult.rows[0].currentstock < data.quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      const totalAmount = stockResult.rows[0].price * data.quantity;
      
      const query = `
        UPDATE Sale
        SET 
          Quantity = $1,
          SaleDate = $2,
          TotalAmount = $3
        WHERE SaleID = $4
        RETURNING *;
      `;
      
      const result = await this.pool.query(query, [
        data.quantity,
        data.saleDate || currentSale.saledate,
        totalAmount,
        id,
      ]);
      
      return result.rows[0];
    } else {
      // Only update date
      const query = `
        UPDATE Sale
        SET SaleDate = $1
        WHERE SaleID = $2
        RETURNING *;
      `;
      
      const result = await this.pool.query(query, [
        data.saleDate || currentSale.saledate,
        id,
      ]);
      
      return result.rows[0];
    }
  }

  async remove(id: number) {
    const query = `
      DELETE FROM Sale
      WHERE SaleID = $1
      RETURNING *;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async getSaleHistory(storeId: number, startDate: Date, endDate: Date) {
    const query = `
      SELECT s.*, p.ProductName, st.StoreName
      FROM Sale s
      JOIN Product p ON s.ProductID = p.ProductID
      JOIN Store st ON s.StoreID = st.StoreID
      WHERE s.StoreID = $1
        AND s.SaleDate BETWEEN $2 AND $3
      ORDER BY s.SaleDate DESC;
    `;
    const result = await this.pool.query(query, [storeId, startDate, endDate]);
    return result.rows;
  }
} 