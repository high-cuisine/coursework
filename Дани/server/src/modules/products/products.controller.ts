import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../../core/decorators/public.decorator';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';

class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  productname: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  @IsNotEmpty()
  @IsNumber()
  categoryid: number;
}

class UpdateProductDto {
  @IsOptional()
  @IsString()
  productname?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsNumber()
  categoryid?: number;
}

class UpdateStockDto {
  @IsNotEmpty()
  @IsNumber()
  store_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  async getProducts() {
    return await this.productsService.getProducts();
  }

  @Get(':id')
  @Public()
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.getProductById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  async createProduct(@Body() productData: CreateProductDto) {
    return await this.productsService.createProduct(productData);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: UpdateProductDto
  ) {
    return await this.productsService.updateProduct(id, productData);
  }

  @Put(':id/stock')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  async updateProductStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() stockData: UpdateStockDto
  ) {
    this.logger.debug(`Updating stock for product ${id} with data:`, stockData);
    
    if (!stockData.store_id || !stockData.quantity) {
      this.logger.error('Missing required fields:', { store_id: stockData.store_id, quantity: stockData.quantity });
      throw new Error('store_id and quantity are required');
    }

    return await this.productsService.updateProductStock(
      id,
      stockData.store_id,
      stockData.quantity
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }
}
