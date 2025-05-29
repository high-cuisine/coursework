import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { StoreModule } from './modules/shop/store.module';
import { SupplyModule } from './modules/supply/supply.module';
import { RequestModule } from './modules/supply/request.module';
import { CategoryModule } from './modules/products/category.module';
import { SaleModule } from './modules/shop/sale.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { RolesGuard } from './modules/auth/roles.guard';
import { JwtAuthGuard } from './modules/auth/jwt.guard';

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
    PurchaseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {} 