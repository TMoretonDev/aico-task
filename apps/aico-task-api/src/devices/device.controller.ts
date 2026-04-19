import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { DeviceResponseInterface } from '@aico-task/shared-types';

@Controller()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get(':id')
  getDevice(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeviceResponseInterface> {
    return this.deviceService.getDevice(id);
  }

  @Get()
  getAllDevices(): Promise<DeviceResponseInterface[]> {
    return this.deviceService.getAllDevices();
  }

  @Patch(':id')
  updateDevice(
    @Param('id', ParseIntPipe) id: number,
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
  deleteDevice(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deviceService.deleteDevice(id);
  }
}
