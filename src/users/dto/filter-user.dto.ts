import { IsOptional, IsEmail, Matches, IsString } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^\+?\d{7,15}$/, { message: 'telefono must be a valid phone number' })
  telefono?: string;

  @IsOptional()
  @Matches(/^\d{3}-\d{2}-\d{4}$/, { message: 'ssn must be in the format XXX-XX-XXXX' })
  ssn?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;
}