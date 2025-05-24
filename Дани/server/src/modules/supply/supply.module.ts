import { Module } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
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
    SupplyService,
    {
      provide: Pool,
      useValue: databasePool,
    },
  ],
  controllers: [SupplyController],
  exports: [SupplyService],
})
export class SupplyModule {}
