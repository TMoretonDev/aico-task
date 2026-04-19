import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateDeviceInterface,
  UpdateDeviceInterface,
  DeviceResponseInterface,
} from '@aico-task/shared-types';
import { DeviceRepository } from './device.repository';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  getAllDevices(): Promise<DeviceResponseInterface[]> {
    return this.deviceRepository.findAll();
  }

  async getDevice(id: number): Promise<DeviceResponseInterface> {
    const device = await this.deviceRepository.findOneById(id);

    if (!device) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }
    return device;
  }

  createDevice(data: CreateDeviceInterface): Promise<DeviceResponseInterface> {
    return this.deviceRepository.createOne(data);
  }

  async updateDevice(
    id: number,
    data: UpdateDeviceInterface,
  ): Promise<DeviceResponseInterface> {
    const deviceToUpdate = await this.deviceRepository.findOneById(id);

    if (!deviceToUpdate) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    return this.deviceRepository.updateOne(deviceToUpdate.id, data);
  }

  async deleteDevice(id: number): Promise<void> {
    const deviceToDelete = await this.deviceRepository.findOneById(id);

    if (!deviceToDelete) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    return this.deviceRepository.deleteOne(deviceToDelete.id);
  }
}
