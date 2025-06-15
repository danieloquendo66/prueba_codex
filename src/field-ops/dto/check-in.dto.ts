import { IsUUID, IsNumber, Min, Max } from 'class-validator';

export class CheckInDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  teamId: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}