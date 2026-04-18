import {
  integer,
  pgTable,
  varchar,
  boolean,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';

// For standard device metadata
export const devices = pgTable('devices', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  typeId: integer('type_id').notNull(),
  online: boolean().notNull().default(false),
  latitude: integer().notNull().default(0),
  longitude: integer().notNull().default(0),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  manufacturer: varchar({ length: 100 }),
  serial_number: uuid().unique(),
});

export const deviceTypes = pgTable('device_types', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 50 }).notNull(),
  description: varchar({ length: 255 }),
});

export const deviceSmokeAlarms = pgTable('device_smoke_alarms', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deviceId: integer('device_id').notNull(),
  smokeLevel: integer('smoke_level').notNull(),
  batteryLevel: integer('battery_level').notNull(),
  sensitivtyLevel: integer('sensitivity_level').notNull(),
});

export const deviceHeatSensors = pgTable('device_heat_sensors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deviceId: integer('device_id').notNull(),
  temperature: integer().notNull(),
  temperature_threshold: integer().notNull(),
});

export const deviceBlackMouldSensors = pgTable('device_black_mould_sensors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deviceId: integer('device_id').notNull(),
  humidity: integer().notNull(),
  temperature: integer().notNull(),
  mouldRiskLevel: integer('mould_risk_level').notNull(),
});

const relations = defineRelations({ devices, deviceTypes }, (r) => ({
  devices: {
    type: r.one.deviceTypes({
      from: r.devices.typeId,
      to: r.deviceTypes.id,
    }),
  },
}));

