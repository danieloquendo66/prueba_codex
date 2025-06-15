import { IsString, Length, IsOptional } from 'class-validator';

export class UpdateServiceCategoryDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}