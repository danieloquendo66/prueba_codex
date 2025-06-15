import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOption } from './entities/service-option.entity';
import { Service } from './entities/service.entity';
import { CreateServiceOptionDto } from './dto/create-service-option.dto';
import { UpdateServiceOptionDto } from './dto/update-service-option.dto';

@Injectable()
export class ServiceOptionsService {
  constructor(
    @InjectRepository(ServiceOption)
    private readonly repo: Repository<ServiceOption>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(dto: CreateServiceOptionDto): Promise<ServiceOption> {
    const svc = await this.serviceRepo.findOneBy({ id: dto.serviceId });
    if (!svc) throw new NotFoundException(`Service ${dto.serviceId} not found`);
    const opt = this.repo.create({
      name: dto.name,
      description: dto.description,
      extraPrice: dto.extraPrice,
      service: svc,
    });
    return this.repo.save(opt);
  }

  findAll(): Promise<ServiceOption[]> {
    return this.repo.find({ relations: ['service'] });
  }

  async findOne(id: string): Promise<ServiceOption> {
    const opt = await this.repo.findOne({ where: { id }, relations: ['service'] });
    if (!opt) throw new NotFoundException(`ServiceOption ${id} not found`);
    return opt;
  }

  async update(id: string, dto: UpdateServiceOptionDto): Promise<ServiceOption> {
    const opt = await this.findOne(id);
    if (dto.serviceId && dto.serviceId !== opt.service.id) {
      const svc = await this.serviceRepo.findOneBy({ id: dto.serviceId });
      if (!svc) throw new NotFoundException(`Service ${dto.serviceId} not found`);
      opt.service = svc;
    }
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.softDelete(id);
  }
}