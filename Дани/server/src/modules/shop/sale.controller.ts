import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

class CreateSaleDto {
  storeId: number;
  productId: number;
  quantity: number;
  saleDate?: Date;
}

class UpdateSaleDto {
  quantity?: number;
  saleDate?: Date;
}

class SaleHistoryDto {
  startDate: Date;
  endDate: Date;
}

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.saleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleService.findOne(+id);
  }

  @Get('store/:storeId/history')
  getSaleHistory(
    @Param('storeId') storeId: string,
    @Query() { startDate, endDate }: SaleHistoryDto,
  ) {
    return this.saleService.getSaleHistory(+storeId, new Date(startDate), new Date(endDate));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.saleService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleService.remove(+id);
  }
} 