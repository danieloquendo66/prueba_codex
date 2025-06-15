import { IsString, Matches } from 'class-validator';

export class VerifyPhoneDto {
  @IsString()
  @Matches(/^\d{5}$/, { message: 'code must be 5 digits' })
  code: string;
}