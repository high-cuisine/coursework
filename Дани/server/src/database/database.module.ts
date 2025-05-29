import { Module } from '@nestjs/common';
import { pool } from './database.config';

const databasePoolFactory = {
    provide: 'DATABASE_POOL',
    useFactory: () => pool,
};

@Module({
    providers: [databasePoolFactory],
    exports: ['DATABASE_POOL'],
})
export class DatabaseModule {} 