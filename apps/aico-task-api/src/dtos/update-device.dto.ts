import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  MaxLength,
  MinLength,
  IsPositive,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { UpdateDeviceInterface } from '@aico-task/shared-types';

export class UpdateDeviceDto implements UpdateDeviceInterface {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  typeID?: number;

  @IsBoolean()
  @IsOptional()
  online?: boolean;

  @IsOptional()
  @IsLatitude()
  latitude?: string;

  @IsOptional()
  @IsLongitude()
  longitude?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsUUID()
  @IsOptional()
  serialNumber?: string;
}
