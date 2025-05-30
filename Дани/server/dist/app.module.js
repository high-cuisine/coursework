"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./modules/auth/auth.module");
const products_module_1 = require("./modules/products/products.module");
const store_module_1 = require("./modules/shop/store.module");
const supply_module_1 = require("./modules/supply/supply.module");
const request_module_1 = require("./modules/supply/request.module");
const category_module_1 = require("./modules/products/category.module");
const sale_module_1 = require("./modules/shop/sale.module");
const reports_module_1 = require("./modules/reports/reports.module");
const purchase_module_1 = require("./modules/purchase/purchase.module");
const roles_guard_1 = require("./modules/auth/roles.guard");
const jwt_guard_1 = require("./modules/auth/jwt.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            store_module_1.StoreModule,
            supply_module_1.SupplyModule,
            request_module_1.RequestModule,
            category_module_1.CategoryModule,
            sale_module_1.SaleModule,
            reports_module_1.ReportsModule,
            purchase_module_1.PurchaseModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map