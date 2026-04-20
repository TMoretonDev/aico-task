import type { Provider } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';
import * as schema from './schema/index';
import { DATABASE, DATABASE_POOL } from './database.tokens';
import { seedDatabase } from './seed';

export const drizzleProvider: Provider = {
  provide: DATABASE,
  inject: [DATABASE_POOL],
  useFactory: async (pool: Pool) => {
    const drizzleInstance = drizzle({ client: pool, schema });

    await seedDatabase(drizzleInstance);

    return drizzleInstance;
  },
};
