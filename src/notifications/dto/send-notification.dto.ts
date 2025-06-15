import { IsEnum, IsString } from 'class-validator';
import { NotificationType } from '../notification.entity';

export class SendNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  recipient: string;

  @IsString()
  payload: string;
}