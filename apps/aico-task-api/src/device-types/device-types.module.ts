import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { DeviceTypesController } from './device-types.controller';
import { DeviceTypesRepository } from './device-types.repository';
import { DeviceTypesService } from './device-types.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DeviceTypesController],
  providers: [DeviceTypesService, DeviceTypesRepository],
  exports: [DeviceTypesService],
})
export class DeviceTypesModule {}
