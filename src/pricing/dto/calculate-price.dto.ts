import { IsUUID, IsNumber, Min, IsArray, IsOptional, IsString } from 'class-validator';

export class CalculatePriceDto {
  @IsUUID()
  serviceId: string;

  @IsNumber()
  @Min(0)
  area: number;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  optionIds?: string[];

  @IsOptional()
  @IsString()
  region?: string;
}