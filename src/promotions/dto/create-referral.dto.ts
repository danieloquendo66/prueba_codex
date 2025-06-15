import { IsUUID } from 'class-validator';

export class CreateReferralDto {
  @IsUUID()
  referrerUserId: string;

  @IsUUID()
  referredUserId: string;
}