"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUser = exports.IsManager = exports.IsAdmin = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
const IsAdmin = () => (0, exports.Roles)(constants_1.ROLES.ADMIN);
exports.IsAdmin = IsAdmin;
const IsManager = () => (0, exports.Roles)(constants_1.ROLES.MANAGER);
exports.IsManager = IsManager;
const IsUser = () => (0, exports.Roles)(constants_1.ROLES.USER);
exports.IsUser = IsUser;
//# sourceMappingURL=roles.decorator.js.map