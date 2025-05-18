import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ShopModule } from 'src/modules/shop/shop.module';

@Module({
  imports: [ShopModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
