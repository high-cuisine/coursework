"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUser = exports.IsManager = exports.IsAdmin = exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const roles_enum_1 = require("../types/roles.enum");
const Roles = (...roles) => (0, common_1.SetMetadata)(roles_enum_1.ROLES_KEY, roles);
exports.Roles = Roles;
const IsAdmin = () => (0, exports.Roles)(roles_enum_1.Role.ADMIN);
exports.IsAdmin = IsAdmin;
const IsManager = () => (0, exports.Roles)(roles_enum_1.Role.MANAGER);
exports.IsManager = IsManager;
const IsUser = () => (0, exports.Roles)(roles_enum_1.Role.USER);
exports.IsUser = IsUser;
//# sourceMappingURL=roles.decorator.js.map