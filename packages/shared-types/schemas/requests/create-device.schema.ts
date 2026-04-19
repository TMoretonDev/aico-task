import { z } from 'zod';

export const createDeviceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  typeId: z.number().int().positive('Type ID must be positive'),
  online: z.boolean(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  serialNumber: z.string().uuid('Must be a valid UUID'),
});

export type CreateDeviceInterface = z.infer<typeof createDeviceSchema>;
