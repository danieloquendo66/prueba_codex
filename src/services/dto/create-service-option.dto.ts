import { IsString, Length, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateServiceOptionDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  serviceId: string;

  @IsNumber()
  @Min(0)
  extraPrice: number;
}