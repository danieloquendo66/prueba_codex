import {
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectItemDto {
  @IsUUID()
  serviceId: string;

  @IsNumber()
  @Min(0)
  area: number;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  optionIds?: string[];
}

export class CreateProjectDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectItemDto)
  items: CreateProjectItemDto[];
}