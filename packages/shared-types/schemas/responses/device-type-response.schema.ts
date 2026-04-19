import { z } from 'zod';

export const deviceTypeResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
});

export type DeviceTypeResponseInterface = z.infer<
  typeof deviceTypeResponseSchema
>;
