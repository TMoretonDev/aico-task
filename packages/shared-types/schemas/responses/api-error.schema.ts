import { z } from 'zod';

export const apiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export type ApiErrorInterface = z.infer<typeof apiErrorSchema>;
