import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from './support-ticket.entity';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepo: Repository<SupportTicket>,
  ) {}

  create(dto: CreateSupportTicketDto): Promise<SupportTicket> {
    const ticket = this.ticketRepo.create(dto);
    return this.ticketRepo.save(ticket);
  }

  findAll(): Promise<SupportTicket[]> {
    return this.ticketRepo.find();
  }

  async findOne(id: string): Promise<SupportTicket> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    return ticket;
  }

  async updateStatus(id: string, dto: UpdateTicketStatusDto): Promise<SupportTicket> {
    const ticket = await this.findOne(id);
    ticket.status = dto.status;
    return this.ticketRepo.save(ticket);
  }
}