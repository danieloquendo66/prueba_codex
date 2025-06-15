import { IsOptional, IsString, Length, IsInt, Min } from 'class-validator';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}