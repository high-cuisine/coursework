import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

class CreateRequestDto {
  storeId: number;
  productId: number;
  requestedQuantity: number;
  requestDate?: Date;
}

class UpdateRequestDto {
  requestedQuantity?: number;
  requestDate?: Date;
}

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(+id);
  }

  @Get('store/:storeId')
  getStoreRequests(
    @Param('storeId') storeId: string,
    @Query('status') status?: string,
  ) {
    return this.requestService.getStoreRequests(+storeId, status);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
} 