import { Controller, Get, Post, Put, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Post()
    async createPurchase(@Body() purchaseData: {
        user_id: number;
        store_id: number;
        product_id: number;
        quantity: number;
        total_amount: number;
    }) {
        return await this.purchaseService.createPurchase(purchaseData);
    }

    @Get('statuses')
    async getPurchaseStatuses() {
        return await this.purchaseService.getPurchaseStatuses();
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin', 'manager')
    async getPurchases() {
        return await this.purchaseService.getPurchases();
    }

    @Get(':id')
    async getPurchaseById(@Param('id', ParseIntPipe) id: number) {
        return await this.purchaseService.getPurchaseById(id);
    }

    @Put(':id/status')
    @UseGuards(RolesGuard)
    @Roles('admin', 'manager')
    async updatePurchaseStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('statusId', ParseIntPipe) statusId: number,
    ) {
        return await this.purchaseService.updatePurchaseStatus(id, statusId);
    }

    @Put(':id/archive')
    @UseGuards(RolesGuard)
    @Roles('admin', 'manager')
    async archivePurchase(@Param('id', ParseIntPipe) id: number) {
        await this.purchaseService.archivePurchase(id);
    }
} 