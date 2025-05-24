import { query } from '../db/database';

export interface Taxpayer {
  taxpayerid: number;
  type: string;
  fullname: string;
  taxid: string;
  registrationaddress: string;
  phone: string;
  email: string;
  registrationdate: Date;
  departmentid: number;
}

export class TaxpayerService {
  async getAllTaxpayers(): Promise<Taxpayer[]> {
    const result = await query('SELECT * FROM Taxpayer');
    return result.rows;
  }

  async getTaxpayerById(id: number): Promise<Taxpayer> {
    const result = await query('SELECT * FROM Taxpayer WHERE TaxpayerID = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Taxpayer not found');
    }
    return result.rows[0];
  }

  async createTaxpayer(taxpayer: Omit<Taxpayer, 'taxpayerid'>): Promise<Taxpayer> {
    const {
      type,
      fullname,
      taxid,
      registrationaddress,
      phone,
      email,
      registrationdate,
      departmentid
    } = taxpayer;

    const result = await query(
      `INSERT INTO Taxpayer (Type, FullName, TaxID, RegistrationAddress, Phone, Email, RegistrationDate, DepartmentID)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [type, fullname, taxid, registrationaddress, phone, email, registrationdate, departmentid]
    );

    return result.rows[0];
  }

  async updateTaxpayer(id: number, taxpayer: Partial<Taxpayer>): Promise<Taxpayer> {
    const fields = Object.keys(taxpayer);
    const values = Object.values(taxpayer);
    
    const setClause = fields
      .map((field, index) => `${field.toLowerCase()} = $${index + 2}`)
      .join(', ');

    const result = await query(
      `UPDATE Taxpayer 
       SET ${setClause}
       WHERE TaxpayerID = $1
       RETURNING *`,
      [id, ...values]
    );

    if (result.rows.length === 0) {
      throw new Error('Taxpayer not found');
    }

    return result.rows[0];
  }

  async deleteTaxpayer(id: number): Promise<void> {
    const result = await query('DELETE FROM Taxpayer WHERE TaxpayerID = $1', [id]);
    if (result.rowCount === 0) {
      throw new Error('Taxpayer not found');
    }
  }

  async getTaxpayerViolations(id: number) {
    const result = await query(
      `SELECT v.*, t.TaxName, i.FirstName, i.LastName
       FROM Violation v
       JOIN Tax t ON v.TaxID = t.TaxID
       JOIN Inspector i ON v.InspectorID = i.InspectorID
       WHERE v.TaxpayerID = $1`,
      [id]
    );
    return result.rows;
  }

  async getTaxpayerFines(id: number) {
    const result = await query(
      `SELECT f.*, v.ViolationDate, v.ViolationDescription
       FROM Fine f
       JOIN Violation v ON f.ViolationID = v.ViolationID
       WHERE v.TaxpayerID = $1`,
      [id]
    );
    return result.rows;
  }
} 