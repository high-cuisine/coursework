import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Public } from '../../core/decorators/public.decorator';

class CreateSupplyDto {
  storeId: number;
  productId: number;
  quantity: number;
  supplyDate?: Date;
}

class UpdateSupplyDto {
  quantity?: number;
  supplyDate?: Date;
}

class SupplyHistoryDto {
  startDate: Date;
  endDate: Date;
}

@Controller('supplies')
@UseGuards(JwtAuthGuard)
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Post()
  create(@Body() createSupplyDto: any) {
    console.log(createSupplyDto, 'test');
    return this.supplyService.create(createSupplyDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.supplyService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplyService.findOne(+id);
  }

  @Public()
  @Get('store/:storeId/history')
  getSupplyHistory(
    @Param('storeId') storeId: string,
    @Query() { startDate, endDate }: SupplyHistoryDto,
  ) {
    return this.supplyService.getSupplyHistory(+storeId, new Date(startDate), new Date(endDate));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSupplyDto: UpdateSupplyDto) {
    return this.supplyService.update(+id, updateSupplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplyService.remove(+id);
  }
}
