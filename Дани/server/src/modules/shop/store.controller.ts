import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

class CreateStoreDto {
  storeName: string;
  address: string;
}

class UpdateStoreDto {
  storeid?: number;
  storename?: string;
  location?: string;
}

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@Body() data: { storeName: string, address: string }) {
    console.log(data, 'test');
    return this.storeService.create(data);
  }

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Get(':id/inventory')
  getStoreInventory(@Param('id') id: string) {
    return this.storeService.getStoreInventory(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    console.log(data, 'test');
    return this.storeService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }

  @Post('migrate/cascade-delete')
  addCascadeDelete() {
    return this.storeService.addCascadeDelete();
  }
} 