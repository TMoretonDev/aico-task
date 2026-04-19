import { Controller, Get } from '@nestjs/common';
import type { DeviceTypeResponseInterface } from '@aico-task/shared-types';
import { DeviceTypesService } from './device-types.service';

@Controller('device-types')
export class DeviceTypesController {
  constructor(private readonly deviceTypesService: DeviceTypesService) {}

  @Get()
  getAllDeviceTypes(): Promise<DeviceTypeResponseInterface[]> {
    return this.deviceTypesService.getAllDeviceTypes();
  }
}
