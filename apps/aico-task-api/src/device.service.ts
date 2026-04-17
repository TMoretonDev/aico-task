import { Injectable } from '@nestjs/common';

@Injectable()
export class DeviceService {
  getAllDevices(): string {
    return 'List of all devices';
  }

  getDevice(id: string): string {
    return `Device with ID ${id}`;
  }

  createDevice(): string {
    return 'Device created!';
  }

  updateDevice(): string {
    return 'Device updated!';
  }

  deleteDevice(): string {
    return 'Device deleted!';
  }
}
