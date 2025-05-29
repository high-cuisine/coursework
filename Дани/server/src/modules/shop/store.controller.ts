import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from '../../core/types/roles.enum';
import { Public } from '../../core/decorators/public.decorator';

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
  @Roles(Role.ADMIN)
  create(@Body() data: { storeName: string, address: string }) {
    console.log(data, 'test');
    return this.storeService.create(data);
  }

  @Public()
  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Public()
  @Get(':id/inventory')
  getStoreInventory(@Param('id') id: string) {
    return this.storeService.getStoreInventory(+id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  update(@Param('id') id: string, @Body() data: any) {
    console.log(data, 'test');
    return this.storeService.update(+id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }

  @Post('migrate/cascade-delete')
  @Roles(Role.ADMIN)
  addCascadeDelete() {
    return this.storeService.addCascadeDelete();
  }
} 