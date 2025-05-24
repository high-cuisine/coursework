import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Pool } from 'pg';
import { databasePool } from '../../core/database.config';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../../core/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn },
    }),
    AuthModule,
  ],
  providers: [
    ProductsService,
    {
      provide: Pool,
      useValue: databasePool,
    },
  ],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
