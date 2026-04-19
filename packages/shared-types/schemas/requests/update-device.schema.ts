import { z } from 'zod';
import { createDeviceSchema } from './create-device.schema';

export const updateDeviceSchema = createDeviceSchema.partial();

export type UpdateDeviceInterface = z.infer<typeof updateDeviceSchema>;
