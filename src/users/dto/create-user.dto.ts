import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{7,15}$/, {
    message: 'telefono must be a valid phone number',
  })
  telefono: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}-\d{2}-\d{4}$/, {
    message: 'ssn must be in the format XXX-XX-XXXX',
  })
  ssn: string;

  @IsString()
  @MinLength(6)
  password: string;
}
