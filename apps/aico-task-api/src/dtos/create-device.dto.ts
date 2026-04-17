import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateDeviceDto {
  @IsEmail()
  name: string;

  @IsNotEmpty()
  password: string;
}