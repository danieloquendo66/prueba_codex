import { IsUUID, IsEnum, IsInt, Min } from 'class-validator';
import { LoyaltyLevel } from '../entities/loyalty-status.entity';

export class CreateLoyaltyStatusDto {
  @IsUUID()
  userId: string;

  @IsEnum(LoyaltyLevel)
  level: LoyaltyLevel;

  @IsInt()
  @Min(0)
  points: number;
}