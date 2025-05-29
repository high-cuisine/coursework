import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { Pool } from 'pg';
import { AuthModule } from '../auth/auth.module';
import { databasePool } from '../../core/database.config';

@Module({
    imports: [AuthModule],
    controllers: [PurchaseController],
    providers: [
        PurchaseService,
        {
            provide: Pool,
            useValue: databasePool,
        },
    ],
    exports: [PurchaseService],
})
export class PurchaseModule {} 