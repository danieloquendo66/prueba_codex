import { IsString, IsUUID } from 'class-validator';

export class CreateSupportTicketDto {
  @IsUUID()
  userId: string;

  @IsString()
  subject: string;

  @IsString()
  description: string;
}