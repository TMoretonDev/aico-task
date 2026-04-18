import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { DeviceResponseInterface } from '@aico-task/shared-types';

@Controller()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get(':id')
  getDevice(@Param('id') id: string): string {
    return this.deviceService.getDevice(id);
  }

  @Get()
  getAllDevices(): string {
    return this.deviceService.getAllDevices();
  }

  @Patch(':id')
  updateDevice(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<DeviceResponseInterface> {
    return this.deviceService.updateDevice(id, updateDeviceDto);
  }

  @Post()
  createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<DeviceResponseInterface> {
    return this.deviceService.createDevice(createDeviceDto);
  }

  @Delete(':id')
  deleteDevice(@Param('id') id: string): string {
    return this.deviceService.deleteDevice(id);
  }
}
