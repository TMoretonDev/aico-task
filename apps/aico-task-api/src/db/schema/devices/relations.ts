import { defineRelations } from 'drizzle-orm';
import { devices } from './devices';
import { deviceTypes } from './device-types';
import {
  deviceBlackMouldSensors,
  deviceHeatSensors,
  deviceSmokeAlarms,
} from './device-sensors';

export const relations = defineRelations(
  {
    devices,
    deviceTypes,
    deviceSmokeAlarms,
    deviceHeatSensors,
    deviceBlackMouldSensors,
  },
  (r) => ({
    devices: {
      type: r.one.deviceTypes({
        from: r.devices.typeId,
        to: r.deviceTypes.id,
      }),
      smokeAlarm: r.one.deviceSmokeAlarms({
        from: r.devices.id,
        to: r.deviceSmokeAlarms.deviceId,
      }),
      heatSensor: r.one.deviceHeatSensors({
        from: r.devices.id,
        to: r.deviceHeatSensors.deviceId,
      }),
      blackMouldSensor: r.one.deviceBlackMouldSensors({
        from: r.devices.id,
        to: r.deviceBlackMouldSensors.deviceId,
      }),
    },
    deviceSmokeAlarms: {
      device: r.one.devices({
        from: r.deviceSmokeAlarms.deviceId,
        to: r.devices.id,
      }),
    },
    deviceHeatSensors: {
      device: r.one.devices({
        from: r.deviceHeatSensors.deviceId,
        to: r.devices.id,
      }),
    },
    deviceBlackMouldSensors: {
      device: r.one.devices({
        from: r.deviceBlackMouldSensors.deviceId,
        to: r.devices.id,
      }),
    },
  }),
);
