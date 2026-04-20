import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { DeviceRepository } from './device.repository';
import { DatabaseModule } from '../db/database.module';
import { DeviceTypesRepository } from '../device-types/device-types.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceRepository, DeviceTypesRepository],
  exports: [DeviceService],
})
export class DeviceModule {}
