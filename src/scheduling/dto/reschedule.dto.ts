import { IsDateString } from 'class-validator';

export class RescheduleDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}