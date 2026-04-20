import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDeviceInterface,
  UpdateDeviceInterface,
  DeviceResponseInterface,
} from '@aico-task/shared-types';
import { DeviceRepository } from './device.repository';
import { DeviceTypesRepository } from '../device-types/device-types.repository';
@Injectable()
export class DeviceService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly deviceTypesRepository: DeviceTypesRepository,
  ) {}

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

  async createDevice(
    data: CreateDeviceInterface,
  ): Promise<DeviceResponseInterface> {
    const device = await this.deviceRepository.findOneBySerialNumber(
      data.serialNumber,
    );

    if (device) {
      throw new BadRequestException(
        `Device with serial number ${data.serialNumber} already exists`,
      );
    }

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

    if (data.typeId) {
      const deviceType = await this.deviceTypesRepository.findOneById(
        data.typeId,
      );
      if (!deviceType) {
        throw new BadRequestException(
          `Device type with id ${data.typeId} not found`,
        );
      }
    }

    return this.deviceRepository.updateOne(deviceToUpdate.id, data);
  }

  async deleteDevice(id: number): Promise<{ message: string }> {
    const deletedDevice = await this.deviceRepository.deleteOne(id);

    if (!deletedDevice) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    return { message: `Device with id ${id} deleted` };
  }
}
