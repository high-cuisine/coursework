"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyController = void 0;
const common_1 = require("@nestjs/common");
const supply_service_1 = require("./supply.service");
const jwt_guard_1 = require("../auth/jwt.guard");
class CreateSupplyDto {
}
class UpdateSupplyDto {
}
class SupplyHistoryDto {
}
let SupplyController = class SupplyController {
    constructor(supplyService) {
        this.supplyService = supplyService;
    }
    create(createSupplyDto) {
        console.log(createSupplyDto, 'test');
        return this.supplyService.create(createSupplyDto);
    }
    findAll() {
        return this.supplyService.findAll();
    }
    findOne(id) {
        return this.supplyService.findOne(+id);
    }
    getSupplyHistory(storeId, { startDate, endDate }) {
        return this.supplyService.getSupplyHistory(+storeId, new Date(startDate), new Date(endDate));
    }
    update(id, updateSupplyDto) {
        return this.supplyService.update(+id, updateSupplyDto);
    }
    remove(id) {
        return this.supplyService.remove(+id);
    }
};
exports.SupplyController = SupplyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupplyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SupplyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupplyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('store/:storeId/history'),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SupplyHistoryDto]),
    __metadata("design:returntype", void 0)
], SupplyController.prototype, "getSupplyHistory", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSupplyDto]),
    __metadata("design:returntype", void 0)
], SupplyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupplyController.prototype, "remove", null);
exports.SupplyController = SupplyController = __decorate([
    (0, common_1.Controller)('supplies'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [supply_service_1.SupplyService])
], SupplyController);
//# sourceMappingURL=supply.controller.js.map