import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ProductsService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getProducts() {
    const query = `
      SELECT 
        p.*,
        c.categoryname,
        COALESCE(s.quantity, 0) as current_stock,
        s.store_id
      FROM product p
      LEFT JOIN category c ON p.categoryid = c.categoryid
      LEFT JOIN stock s ON p.productid = s.product_id
      ORDER BY p.productid;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getProductById(id: number) {
    const query = `
      SELECT p.*, c.categoryname
      FROM product p
      LEFT JOIN category c ON p.categoryid = c.categoryid
      WHERE p.productid = $1;
    `;
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async createProduct(data: {
    productname: string;
    description: string;
    price: number;
    image_url: string;
    categoryid: number;
  }) {
    const query = `
      INSERT INTO product (productname, description, price, image_url, categoryid)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await this.pool.query(query, [
      data.productname,
      data.description,
      data.price,
      data.image_url,
      data.categoryid,
    ]);
    return result.rows[0];
  }

  async updateProduct(id: number, data: {
    productname?: string;
    description?: string;
    price?: number;
    image_url?: string;
    categoryid?: number;
  }) {
    const query = `
      UPDATE product
      SET productname = COALESCE($1, productname),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          image_url = COALESCE($4, image_url),
          categoryid = COALESCE($5, categoryid)
      WHERE productid = $6
      RETURNING *;
    `;
    const result = await this.pool.query(query, [
      data.productname,
      data.description,
      data.price,
      data.image_url,
      data.categoryid,
      id,
    ]);
    
    if (result.rows.length === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return result.rows[0];
  }

  async updateProductStock(productId: number, storeId: number, quantity: number) {
    const checkResult = await this.pool.query(
      'SELECT * FROM stock WHERE product_id = $1 AND store_id = $2',
      [productId, storeId]
    );

    if (checkResult.rows.length === 0) {
      const insertQuery = `
        INSERT INTO stock (product_id, store_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const result = await this.pool.query(insertQuery, [productId, storeId, quantity]);
      return result.rows[0];
    } else {
      const updateQuery = `
        UPDATE stock
        SET quantity = $3
        WHERE product_id = $1 AND store_id = $2
        RETURNING *;
      `;
      const result = await this.pool.query(updateQuery, [productId, storeId, quantity]);
      return result.rows[0];
    }
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
