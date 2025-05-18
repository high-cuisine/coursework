import { Controller, Get, Param, Post, Body, Put, Req, Delete, Res } from '@nestjs/common';
import { SupplyService } from './supply.service';

@Controller('supply')
export class SupplyController {

    constructor(
        private readonly supplyService: SupplyService
    ) {}
    @Get()
    async getSupply() {
        return this.supplyService.getTAllSupply();
    }

    @Get(':id')
    async getSupplyById(@Param('id') id: number) {
        return this.supplyService.getSupplyById(id);
    }

    @Post()
    async createSupply(@Req() req: Request, @Res() res: Response) {
        const { store_id, month, total_revenue } = req.body as unknown as { store_id: number, month: number, total_revenue: number };
        return this.supplyService.createSupply(Number(store_id), Number(month), Number(total_revenue));
    }

    @Put(':id')
    async updateSupply(@Param('id') id: number, @Body() supply: any) {
        return this.supplyService.updateSupply(id, supply);
    }
    
    @Delete(':id')
    async deleteSupply(@Param('id') id: number) {
        return this.supplyService.deleteSupply(id);
    }
}
