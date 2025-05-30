import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Public } from '../../core/decorators/public.decorator';

class CreateCategoryDto {
  categoryName: string;
}

class UpdateCategoryDto {
  categoryName: string;
}

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Post('/')
  create(@Body() categoryName: string) {
    console.log(categoryName);
    return this.categoryService.create({ categoryName });
  }

  @Get(':id/products')
  getProductsByCategory(@Param('id') id: string) {
    return this.categoryService.getProductsByCategory(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    console.log('test',id, updateCategoryDto);
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('test',id);
    return this.categoryService.remove(+id);
  }
} 