import { Injectable } from '@nestjs/common';
import {
  CreateDeviceInterface,
  UpdateDeviceInterface,
} from '@aico-task/shared-types';

@Injectable()
export class DeviceService {
  getAllDevices(): string {
    return 'List of all devices';
  }

  getDevice(id: string): string {
    return `Device with ID ${id}`;
  }

  createDevice(createDeviceData: CreateDeviceInterface): string {
    return `Device created using data: ${JSON.stringify(createDeviceData)}`;
  }

  updateDevice(updateDeviceData: UpdateDeviceInterface): string {
    return `Device updated using data: ${JSON.stringify(updateDeviceData)}`;
  }

  deleteDevice(id: string): string {
    return `Device ID: ${id} deleted!`;
  }
}
