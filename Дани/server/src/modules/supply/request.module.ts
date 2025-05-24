import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
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
    RequestService,
    {
      provide: Pool,
      useValue: databasePool,
    },
  ],
  controllers: [RequestController],
  exports: [RequestService],
})
export class RequestModule {}
 