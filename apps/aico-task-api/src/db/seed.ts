import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const deviceTypesSeedData: (typeof schema.deviceTypes.$inferInsert)[] = [
  { name: 'Smoke Alarm', description: 'Detects smoke' },
  { name: 'Heat Sensor', description: 'Ambient temperature' },
  { name: 'Black Mould Sensor', description: 'Humidity / mould risk' },
];

export async function seedDatabase(
  db: NodePgDatabase<typeof schema>,
): Promise<void> {
  await db
    .insert(schema.deviceTypes)
    .values(deviceTypesSeedData)
    .onConflictDoNothing({ target: schema.deviceTypes.name });
}
