import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
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
    CategoryService,
    {
      provide: Pool,
      useValue: databasePool,
    },
  ],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {} 