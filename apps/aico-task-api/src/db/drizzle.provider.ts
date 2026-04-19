import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index';
import { DATABASE } from './database.tokens';
import { seedDatabase } from './seed';

export const drizzleProvider: Provider = {
  provide: DATABASE,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const drizzleInstance = drizzle({
      client: new Pool({
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        user: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
      }),
      schema,
    });

    await seedDatabase(drizzleInstance);

    return drizzleInstance;
  },
};
