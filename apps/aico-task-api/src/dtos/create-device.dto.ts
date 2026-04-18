import {
  IsString,
  IsNumber,
  IsBoolean,
  IsUUID,
  MaxLength,
  MinLength,
  IsPositive,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { CreateDeviceInterface } from '@aico-task/shared-types';

export class CreateDeviceDto implements CreateDeviceInterface {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @IsPositive()
  typeID: number;

  @IsBoolean()
  online: boolean;

  @IsLatitude()
  latitude: string;

  @IsLongitude()
  longitude: string;

  @IsString()
  manufacturer: string;

  @IsUUID()
  serialNumber: string;
}
