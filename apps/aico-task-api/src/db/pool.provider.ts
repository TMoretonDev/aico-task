import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DATABASE_POOL } from './database.tokens';

export const poolProvider: Provider = {
  provide: DATABASE_POOL,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    new Pool({
      host: config.get<string>('DB_HOST'),
      port: config.get<number>('DB_PORT'),
      user: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'),
      database: config.get<string>('DB_NAME'),
    }),
};
