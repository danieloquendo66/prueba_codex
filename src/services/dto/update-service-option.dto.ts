import { IsString, Length, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class UpdateServiceOptionDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  extraPrice?: number;
}