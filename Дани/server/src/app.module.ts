import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { StoreModule } from './modules/shop/store.module';
import { SupplyModule } from './modules/supply/supply.module';
import { RequestModule } from './modules/supply/request.module';
import { CategoryModule } from './modules/products/category.module';
import { SaleModule } from './modules/shop/sale.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    StoreModule,
    SupplyModule,
    RequestModule,
    CategoryModule,
    SaleModule,
    ReportsModule,
  ],
})
export class AppModule {} 