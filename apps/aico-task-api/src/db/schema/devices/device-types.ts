import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const deviceTypes = pgTable('device_types', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 50 }).notNull().unique(),
  description: varchar({ length: 255 }),
});

export type DeviceType = typeof deviceTypes.$inferSelect;
export type NewDeviceType = typeof deviceTypes.$inferInsert;
