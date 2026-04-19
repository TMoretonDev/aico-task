import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeviceModule } from './devices/device.module';
import { DeviceTypesModule } from './device-types/device-types.module';

@Module({
  imports: [ConfigModule.forRoot(), DeviceModule, DeviceTypesModule],
})
export class AppModule {}
