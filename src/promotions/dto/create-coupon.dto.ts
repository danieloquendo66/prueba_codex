import { IsString, IsInt, Min, Max, IsDateString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsInt()
  @Min(1)
  @Max(100)
  discountPercentage: number;

  @IsDateString()
  expiresAt: string;
}