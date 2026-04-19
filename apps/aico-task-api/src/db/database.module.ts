import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { drizzleProvider } from './drizzle.provider';
import { DATABASE } from './database.tokens';

@Module({
  imports: [ConfigModule],
  providers: [drizzleProvider],
  exports: [DATABASE],
})
export class DatabaseModule {}
