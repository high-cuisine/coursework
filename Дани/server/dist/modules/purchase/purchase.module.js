"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseModule = void 0;
const common_1 = require("@nestjs/common");
const purchase_controller_1 = require("./purchase.controller");
const purchase_service_1 = require("./purchase.service");
const pg_1 = require("pg");
const auth_module_1 = require("../auth/auth.module");
const database_config_1 = require("../../core/database.config");
let PurchaseModule = class PurchaseModule {
};
exports.PurchaseModule = PurchaseModule;
exports.PurchaseModule = PurchaseModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [purchase_controller_1.PurchaseController],
        providers: [
            purchase_service_1.PurchaseService,
            {
                provide: pg_1.Pool,
                useValue: database_config_1.databasePool,
            },
        ],
        exports: [purchase_service_1.PurchaseService],
    })
], PurchaseModule);
//# sourceMappingURL=purchase.module.js.map