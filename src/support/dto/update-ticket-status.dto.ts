import { IsEnum } from 'class-validator';
import { TicketStatus } from '../support-ticket.entity';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;
}