"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorService = void 0;
const database_1 = require("../db/database");
class InspectorService {
    async getAllInspectors() {
        const result = await (0, database_1.query)('SELECT * FROM Inspector');
        return result.rows;
    }
    async getInspectorById(id) {
        const result = await (0, database_1.query)('SELECT * FROM Inspector WHERE InspectorID = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error('Inspector not found');
        }
        return result.rows[0];
    }
    async createInspector(inspector) {
        const { lastname, firstname, middlename, position, hiredate, accesslevel, departmentid } = inspector;
        const result = await (0, database_1.query)(`INSERT INTO Inspector (LastName, FirstName, MiddleName, Position, HireDate, AccessLevel, DepartmentID)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`, [lastname, firstname, middlename, position, hiredate, accesslevel, departmentid]);
        return result.rows[0];
    }
    async updateInspector(id, inspector) {
        const fields = Object.keys(inspector);
        const values = Object.values(inspector);
        const setClause = fields
            .map((field, index) => `${field.toLowerCase()} = $${index + 2}`)
            .join(', ');
        const result = await (0, database_1.query)(`UPDATE Inspector 
       SET ${setClause}
       WHERE InspectorID = $1
       RETURNING *`, [id, ...values]);
        if (result.rows.length === 0) {
            throw new Error('Inspector not found');
        }
        return result.rows[0];
    }
    async deleteInspector(id) {
        const result = await (0, database_1.query)('DELETE FROM Inspector WHERE InspectorID = $1', [id]);
        if (result.rowCount === 0) {
            throw new Error('Inspector not found');
        }
    }
    async getInspectorViolations(id) {
        const result = await (0, database_1.query)(`SELECT v.*, t.TaxName, tp.FullName as TaxpayerName
       FROM Violation v
       JOIN Tax t ON v.TaxID = t.TaxID
       JOIN Taxpayer tp ON v.TaxpayerID = tp.TaxpayerID
       WHERE v.InspectorID = $1`, [id]);
        return result.rows;
    }
    async getInspectorDepartment(id) {
        const result = await (0, database_1.query)(`SELECT d.*
       FROM Department d
       JOIN Inspector i ON d.DepartmentID = i.DepartmentID
       WHERE i.InspectorID = $1`, [id]);
        return result.rows[0];
    }
}
exports.InspectorService = InspectorService;
//# sourceMappingURL=inspector.service.js.map