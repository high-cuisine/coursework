"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViolationService = void 0;
const database_1 = require("../db/database");
class ViolationService {
    async getAllViolations() {
        const result = await (0, database_1.query)(`
      SELECT v.*, t.TaxName, tp.FullName as TaxpayerName, 
             i.FirstName as InspectorFirstName, i.LastName as InspectorLastName
      FROM Violation v
      JOIN Tax t ON v.TaxID = t.TaxID
      JOIN Taxpayer tp ON v.TaxpayerID = tp.TaxpayerID
      JOIN Inspector i ON v.InspectorID = i.InspectorID
    `);
        return result.rows;
    }
    async getViolationById(id) {
        const result = await (0, database_1.query)(`
      SELECT v.*, t.TaxName, tp.FullName as TaxpayerName, 
             i.FirstName as InspectorFirstName, i.LastName as InspectorLastName
      FROM Violation v
      JOIN Tax t ON v.TaxID = t.TaxID
      JOIN Taxpayer tp ON v.TaxpayerID = tp.TaxpayerID
      JOIN Inspector i ON v.InspectorID = i.InspectorID
      WHERE v.ViolationID = $1
    `, [id]);
        if (result.rows.length === 0) {
            throw new Error('Violation not found');
        }
        return result.rows[0];
    }
    async createViolation(violation) {
        const { violationdate, violationperiod, nonpaymentamount, violationdescription, status, paymentoverdue, taxpayerid, taxid, inspectorid } = violation;
        const result = await (0, database_1.query)(`INSERT INTO Violation (
        ViolationDate, ViolationPeriod, NonPaymentAmount, ViolationDescription,
        Status, PaymentOverdue, TaxpayerID, TaxID, InspectorID
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`, [violationdate, violationperiod, nonpaymentamount, violationdescription,
            status, paymentoverdue, taxpayerid, taxid, inspectorid]);
        return result.rows[0];
    }
    async updateViolation(id, violation) {
        const fields = Object.keys(violation);
        const values = Object.values(violation);
        const setClause = fields
            .map((field, index) => `${field.toLowerCase()} = $${index + 2}`)
            .join(', ');
        const result = await (0, database_1.query)(`UPDATE Violation 
       SET ${setClause}
       WHERE ViolationID = $1
       RETURNING *`, [id, ...values]);
        if (result.rows.length === 0) {
            throw new Error('Violation not found');
        }
        return result.rows[0];
    }
    async createFine(fine) {
        const { fineamount, chargedate, paymentdeadline, paymentstatus, paymentdate, violationid } = fine;
        const result = await (0, database_1.query)(`INSERT INTO Fine (
        FineAmount, ChargeDate, PaymentDeadline, PaymentStatus,
        PaymentDate, ViolationID
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`, [fineamount, chargedate, paymentdeadline, paymentstatus,
            paymentdate, violationid]);
        return result.rows[0];
    }
    async updateFine(id, fine) {
        const fields = Object.keys(fine);
        const values = Object.values(fine);
        const setClause = fields
            .map((field, index) => `${field.toLowerCase()} = $${index + 2}`)
            .join(', ');
        const result = await (0, database_1.query)(`UPDATE Fine 
       SET ${setClause}
       WHERE FineID = $1
       RETURNING *`, [id, ...values]);
        if (result.rows.length === 0) {
            throw new Error('Fine not found');
        }
        return result.rows[0];
    }
    async getViolationFines(violationId) {
        const result = await (0, database_1.query)('SELECT * FROM Fine WHERE ViolationID = $1', [violationId]);
        return result.rows;
    }
    async getOverdueViolations() {
        const result = await (0, database_1.query)(`
      SELECT v.*, t.TaxName, tp.FullName as TaxpayerName
      FROM Violation v
      JOIN Tax t ON v.TaxID = t.TaxID
      JOIN Taxpayer tp ON v.TaxpayerID = tp.TaxpayerID
      WHERE v.PaymentOverdue = true
    `);
        return result.rows;
    }
    async getViolationsByStatus(status) {
        const result = await (0, database_1.query)(`
      SELECT v.*, t.TaxName, tp.FullName as TaxpayerName
      FROM Violation v
      JOIN Tax t ON v.TaxID = t.TaxID
      JOIN Taxpayer tp ON v.TaxpayerID = tp.TaxpayerID
      WHERE v.Status = $1
    `, [status]);
        return result.rows;
    }
}
exports.ViolationService = ViolationService;
//# sourceMappingURL=violation.service.js.map