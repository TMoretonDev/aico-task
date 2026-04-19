import { z } from 'zod';

export const deviceResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  typeId: z.number(),
  online: z.boolean(),
  latitude: z.number(),
  longitude: z.number(),
  manufacturer: z.string(),
  serialNumber: z.string(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export type DeviceResponseInterface = z.infer<typeof deviceResponseSchema>;
