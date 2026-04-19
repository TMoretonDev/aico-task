import { createZodDto } from 'nestjs-zod';
import { createDeviceSchema } from '@aico-task/shared-types';

export class CreateDeviceDto extends createZodDto(createDeviceSchema) {}
