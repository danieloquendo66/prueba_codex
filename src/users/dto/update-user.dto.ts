import { IsString, MinLength, IsOptional, IsEmail, IsEnum, Matches } from 'class-validator';
import { UserRole } from '../enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{7,15}$/, { message: 'telefono must be a valid phone number' })
  telefono?: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}-\d{2}-\d{4}$/, { message: 'ssn must be in the format XXX-XX-XXXX' })
  ssn?: string;
  
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}