import { integer, pgTable } from 'drizzle-orm/pg-core';
import { devices } from './devices';

export const deviceSmokeAlarms = pgTable('device_smoke_alarms', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deviceId: integer('device_id')
    .notNull()
    .unique()
    .references(() => devices.id, { onDelete: 'cascade' }),
  smokeLevel: integer('smoke_level').notNull(),
  batteryLevel: integer('battery_level').notNull(),
  sensitivtyLevel: integer('sensitivity_level').notNull(),
});

export const deviceHeatSensors = pgTable('device_heat_sensors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deviceId: integer('device_id')
    .notNull()
    .unique()
    .references(() => devices.id, { onDelete: 'cascade' }),
  temperature: integer().notNull(),
  temperature_threshold: integer().notNull(),
});

export const deviceBlackMouldSensors = pgTable('device_black_mould_sensors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deviceId: integer('device_id')
    .notNull()
    .unique()
    .references(() => devices.id, { onDelete: 'cascade' }),
  humidity: integer().notNull(),
  temperature: integer().notNull(),
  mouldRiskLevel: integer('mould_risk_level').notNull(),
});
