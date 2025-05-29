import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async getProducts() {
        return await this.productService.getProducts();
    }

    @Get(':id')
    async getProductById(@Param('id') id: number) {
        return await this.productService.getProductById(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin', 'manager')
    async createProduct(@Body() productData: any) {
        return await this.productService.createProduct(productData);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'manager')
    async updateProduct(@Param('id') id: number, @Body() productData: any) {
        return await this.productService.updateProduct(id, productData);
    }

    @Put(':id/stock')
    @UseGuards(RolesGuard)
    @Roles('admin', 'manager')
    async updateProductStock(
        @Param('id') id: number,
        @Body() stockData: { store_id: number; quantity: number }
    ) {
        return await this.productService.updateProductStock(id, stockData.store_id, stockData.quantity);
    }
} 