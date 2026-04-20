import { Inject, Module, type OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { Pool } from 'pg';
import { drizzleProvider } from './drizzle.provider';
import { poolProvider } from './pool.provider';
import { DATABASE, DATABASE_POOL } from './database.tokens';

@Module({
  imports: [ConfigModule],
  providers: [poolProvider, drizzleProvider],
  exports: [DATABASE],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}
