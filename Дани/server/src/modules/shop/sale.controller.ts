import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/types/roles.enum';

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
  @Roles(Role.USER, Role.MANAGER, Role.ADMIN)
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.create(createSaleDto);
  }

  @Get()
  @Roles(Role.MANAGER, Role.ADMIN)
  findAll() {
    return this.saleService.findAll();
  }

  @Get(':id')
  @Roles(Role.USER, Role.MANAGER, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.saleService.findOne(+id);
  }

  @Get('store/:storeId/history')
  @Roles(Role.MANAGER, Role.ADMIN)
  getSaleHistory(
    @Param('storeId') storeId: string,
    @Query() { startDate, endDate }: SaleHistoryDto,
  ) {
    return this.saleService.getSaleHistory(+storeId, new Date(startDate), new Date(endDate));
  }

  @Put(':id')
  @Roles(Role.MANAGER, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.saleService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.saleService.remove(+id);
  }
} 