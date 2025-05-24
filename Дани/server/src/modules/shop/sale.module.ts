import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
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
    SaleService,
    {
      provide: Pool,
      useValue: databasePool,
    },
  ],
  controllers: [SaleController],
  exports: [SaleService],
})
export class SaleModule {} 