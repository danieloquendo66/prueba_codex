import { IsUUID, IsDateString, IsNumber, IsPositive } from 'class-validator';

export class CreatePayrollDto {
  @IsUUID()
  teamId: string;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

  @IsNumber()
  @IsPositive()
  hourlyRate: number;
}