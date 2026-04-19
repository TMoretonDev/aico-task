import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const devices = pgTable('devices', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  typeId: integer('type_id').notNull(),
  online: boolean().notNull().default(false),
  latitude: doublePrecision().notNull().default(0),
  longitude: doublePrecision().notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  manufacturer: varchar({ length: 100 }).notNull(),
  serialNumber: uuid('serial_number').unique().notNull(),
});
