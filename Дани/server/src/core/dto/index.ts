import { IsString, IsEmail, MinLength, IsNumber, IsPositive, IsOptional, IsDate, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class CreateProductDto {
  @IsString()
  productName: string;

  @IsNumber()
  @IsPositive()
  categoryId: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;
}

export class CreateCategoryDto {
  @IsString()
  categoryName: string;
}

export class UpdateCategoryDto {
  @IsString()
  categoryName: string;
}

export class CreateStoreDto {
  @IsString()
  storeName: string;

  @IsString()
  location: string;
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class CreateSupplyDto {
  @IsNumber()
  @IsPositive()
  storeId: number;

  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  supplyDate?: Date;
}

export class UpdateSupplyDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  supplyDate?: Date;
}

export class CreateSaleDto {
  @IsNumber()
  @IsPositive()
  storeId: number;

  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  saleDate?: Date;
}

export class UpdateSaleDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  saleDate?: Date;
}

export class CreateRequestDto {
  @IsNumber()
  @IsPositive()
  storeId: number;

  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  requestedQuantity: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  requestDate?: Date;
}

export class UpdateRequestDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  requestedQuantity?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  requestDate?: Date;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';
}

export class DateRangeDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
} 