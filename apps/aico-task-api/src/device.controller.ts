import { Controller, Delete, Get, Patch, Post, Body } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dtos/create-device.dto';

@Controller()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  getAllDevices(): string {
    return this.deviceService.getAllDevices();
  }

  @Patch()
  updateDevice(@Body() updateDeviceDto: UpdateDeviceDto): string {
    return this.deviceService.updateDevice(updateDeviceDto);
  }

  @Post()
  createDevice(@Body() createDeviceDto: CreateDeviceDto): string {
    return this.deviceService.createDevice(createDeviceDto);
  }

  @Delete()
  deleteDevice(): string {
    return this.deviceService.deleteDevice();
  }
}
