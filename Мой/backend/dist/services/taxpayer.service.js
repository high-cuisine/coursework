"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxpayerService = void 0;
const database_1 = require("../db/database");
class TaxpayerService {
    async getAllTaxpayers() {
        const result = await (0, database_1.query)('SELECT * FROM Taxpayer');
        return result.rows;
    }
    async getTaxpayerById(id) {
        const result = await (0, database_1.query)('SELECT * FROM Taxpayer WHERE TaxpayerID = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Taxpayer not found');
        }
        return result.rows[0];
    }
    async createTaxpayer(taxpayer) {
        const { type, fullname, taxid, registrationaddress, phone, email, registrationdate, departmentid } = taxpayer;
        const result = await (0, database_1.query)(`INSERT INTO Taxpayer (Type, FullName, TaxID, RegistrationAddress, Phone, Email, RegistrationDate, DepartmentID)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`, [type, fullname, taxid, registrationaddress, phone, email, registrationdate, departmentid]);
        return result.rows[0];
    }
    async updateTaxpayer(id, taxpayer) {
        const fields = Object.keys(taxpayer);
        const values = Object.values(taxpayer);
        const setClause = fields
            .map((field, index) => `${field.toLowerCase()} = $${index + 2}`)
            .join(', ');
        const result = await (0, database_1.query)(`UPDATE Taxpayer 
       SET ${setClause}
       WHERE TaxpayerID = $1
       RETURNING *`, [id, ...values]);
        if (result.rows.length === 0) {
            throw new Error('Taxpayer not found');
        }
        return result.rows[0];
    }
    async deleteTaxpayer(id) {
        const result = await (0, database_1.query)('DELETE FROM Taxpayer WHERE TaxpayerID = $1', [id]);
        if (result.rowCount === 0) {
            throw new Error('Taxpayer not found');
        }
    }
    async getTaxpayerViolations(id) {
        const result = await (0, database_1.query)(`SELECT v.*, t.TaxName, i.FirstName, i.LastName
       FROM Violation v
       JOIN Tax t ON v.TaxID = t.TaxID
       JOIN Inspector i ON v.InspectorID = i.InspectorID
       WHERE v.TaxpayerID = $1`, [id]);
        return result.rows;
    }
    async getTaxpayerFines(id) {
        const result = await (0, database_1.query)(`SELECT f.*, v.ViolationDate, v.ViolationDescription
       FROM Fine f
       JOIN Violation v ON f.ViolationID = v.ViolationID
       WHERE v.TaxpayerID = $1`, [id]);
        return result.rows;
    }
}
exports.TaxpayerService = TaxpayerService;
//# sourceMappingURL=taxpayer.service.js.map