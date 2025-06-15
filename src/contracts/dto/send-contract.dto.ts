import { IsString, IsEmail, IsUrl } from 'class-validator';

export class SendContractDto {
  @IsString()
  recipientName: string;

  @IsEmail()
  recipientEmail: string;

  @IsUrl()
  returnUrl: string;
}