"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyModule = void 0;
const common_1 = require("@nestjs/common");
const supply_service_1 = require("./supply.service");
const supply_controller_1 = require("./supply.controller");
const pg_1 = require("pg");
const database_config_1 = require("../../core/database.config");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("../../core/config");
const auth_module_1 = require("../auth/auth.module");
let SupplyModule = class SupplyModule {
};
exports.SupplyModule = SupplyModule;
exports.SupplyModule = SupplyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: config_1.config.jwt.secret,
                signOptions: { expiresIn: config_1.config.jwt.expiresIn },
            }),
            auth_module_1.AuthModule,
        ],
        providers: [
            supply_service_1.SupplyService,
            {
                provide: pg_1.Pool,
                useValue: database_config_1.databasePool,
            },
        ],
        controllers: [supply_controller_1.SupplyController],
        exports: [supply_service_1.SupplyService],
    })
], SupplyModule);
//# sourceMappingURL=supply.module.js.map