import { Injectable } from '@nestjs/common';
import type { DeviceTypeResponseInterface } from '@aico-task/shared-types';
import { DeviceTypesRepository } from './device-types.repository';

@Injectable()
export class DeviceTypesService {
  constructor(
    private readonly deviceTypesRepository: DeviceTypesRepository,
  ) {}

  getAllDeviceTypes(): Promise<DeviceTypeResponseInterface[]> {
    return this.deviceTypesRepository.findAll();
  }
}
