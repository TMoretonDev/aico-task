import { createZodDto } from 'nestjs-zod';
import { updateDeviceSchema } from '@aico-task/shared-types';

export class UpdateDeviceDto extends createZodDto(updateDeviceSchema) {}
