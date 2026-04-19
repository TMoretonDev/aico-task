import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { DeviceResponseInterface } from '@aico-task/shared-types';

@ApiTags('devices')
@Controller('devices')
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
  @HttpCode(HttpStatus.CREATED)
  createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<DeviceResponseInterface> {
    return this.deviceService.createDevice(createDeviceDto);
  }

  @Delete(':id')
  deleteDevice(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.deviceService.deleteDevice(id);
  }
}
