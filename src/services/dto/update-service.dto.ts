import { IsString, Length, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;
}