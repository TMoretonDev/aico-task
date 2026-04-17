import {
  integer,
  pgTable,
  varchar,
  boolean,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';

export const devices = pgTable('devices', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  typeId: integer('type_id').notNull(),
  online: boolean().notNull().default(false),
  location: jsonb('location').notNull().default({ lat: 0, lng: 0 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  manufacturer: varchar({ length: 255 }),
  serial_number: varchar({ length: 255 }).unique(),
});

export const deviceTypes = pgTable('device_types', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 50 }).notNull(),
  description: varchar({ length: 255 }),
});

const relations = defineRelations({ devices, deviceTypes }, (r) => ({
  devices: {
    type: r.one.deviceTypes({
      from: r.devices.typeId,
      to: r.deviceTypes.id,
    }),
  },
}));
