import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicket } from './support-ticket.entity';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupportTicket])],
  providers: [SupportService],
  controllers: [SupportController],
})
export class SupportModule {}