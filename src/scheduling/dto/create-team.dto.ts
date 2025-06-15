import { IsString, Length, IsInt, Min } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;
}