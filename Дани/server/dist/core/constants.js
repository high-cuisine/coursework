"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUCCESS_MESSAGES = exports.ERROR_MESSAGES = exports.ORDER_BY = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = exports.REQUEST_STATUS = exports.ROLES = void 0;
exports.ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MANAGER: 'manager',
};
exports.REQUEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};
exports.DEFAULT_PAGE_SIZE = 10;
exports.MAX_PAGE_SIZE = 100;
exports.ORDER_BY = {
    ASC: 'ASC',
    DESC: 'DESC',
};
exports.ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INSUFFICIENT_STOCK: 'Insufficient stock',
    DUPLICATE_ENTRY: 'Duplicate entry',
    INVALID_CREDENTIALS: 'Invalid credentials',
};
exports.SUCCESS_MESSAGES = {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful',
};
//# sourceMappingURL=constants.js.map