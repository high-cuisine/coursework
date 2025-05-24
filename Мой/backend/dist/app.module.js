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
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const taxpayers_module_1 = require("./taxpayers/taxpayers.module");
const inspectors_module_1 = require("./inspectors/inspectors.module");
const violations_module_1 = require("./violations/violations.module");
const departments_module_1 = require("./departments/departments.module");
const taxes_module_1 = require("./taxes/taxes.module");
const fines_module_1 = require("./fines/fines.module");
const properties_module_1 = require("./properties/properties.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            taxpayers_module_1.TaxpayersModule,
            inspectors_module_1.InspectorsModule,
            violations_module_1.ViolationsModule,
            departments_module_1.DepartmentsModule,
            taxes_module_1.TaxesModule,
            fines_module_1.FinesModule,
            properties_module_1.PropertiesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map