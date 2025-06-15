import { IsString, Length, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  categoryId: string;

  @IsNumber()
  @Min(0)
  basePrice: number;
}