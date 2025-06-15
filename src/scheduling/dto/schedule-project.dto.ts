import { IsUUID, IsDateString } from 'class-validator';

export class ScheduleProjectDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  teamId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}