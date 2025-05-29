import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AuthModule } from '../auth/auth.module';
import { Pool } from 'pg';
import { databasePool } from '../../core/database.config';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [
    ReportsService,
    {
      provide: Pool,
      useValue: databasePool,
    },
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
