import { IsUUID, IsNumber, IsString, IsPositive } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsUUID()
  projectId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  currency: string;
}