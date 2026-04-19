import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { reset, seed } from 'drizzle-seed';
import { Pool } from 'pg';
import * as schema from './schema';

async function main() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  const db = drizzle({ client: pool, schema });

  await reset(db, { deviceTypes: schema.deviceTypes });

  await seed(db, { deviceTypes: schema.deviceTypes }).refine((f) => ({
    deviceTypes: {
      count: 3,
      columns: {
        name: f.valuesFromArray({
          values: ['Smoke Alarm', 'Heat Sensor', 'Black Mould Sensor'],
          isUnique: true,
        }),
        description: f.valuesFromArray({
          values: [
            'Detects smoke',
            'Ambient temperature',
            'Humidity / mould risk',
          ],
          isUnique: true,
        }),
      },
    },
  }));

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
