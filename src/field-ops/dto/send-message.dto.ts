import { IsUUID, IsString } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  toUserId: string;

  @IsString()
  content: string;
}