"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleModule = void 0;
const common_1 = require("@nestjs/common");
const sale_service_1 = require("./sale.service");
const sale_controller_1 = require("./sale.controller");
const pg_1 = require("pg");
const database_config_1 = require("../../core/database.config");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("../../core/config");
const auth_module_1 = require("../auth/auth.module");
let SaleModule = class SaleModule {
};
exports.SaleModule = SaleModule;
exports.SaleModule = SaleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: config_1.config.jwt.secret,
                signOptions: { expiresIn: config_1.config.jwt.expiresIn },
            }),
            auth_module_1.AuthModule,
        ],
        providers: [
            sale_service_1.SaleService,
            {
                provide: pg_1.Pool,
                useValue: database_config_1.databasePool,
            },
        ],
        controllers: [sale_controller_1.SaleController],
        exports: [sale_service_1.SaleService],
    })
], SaleModule);
//# sourceMappingURL=sale.module.js.map