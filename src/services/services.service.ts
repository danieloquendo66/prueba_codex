import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServiceCategory } from './entities/service-category.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly repo: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private readonly categoryRepo: Repository<ServiceCategory>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
    if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);
    const svc = this.repo.create({
      name: dto.name,
      description: dto.description,
      basePrice: dto.basePrice,
      category,
    });
    return this.repo.save(svc);
  }

  findAll(): Promise<Service[]> {
    return this.repo.find({ relations: ['category', 'options'] });
  }

  async findOne(id: string): Promise<Service> {
    const svc = await this.repo.findOne({ where: { id }, relations: ['category', 'options'] });
    if (!svc) throw new NotFoundException(`Service ${id} not found`);
    return svc;
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const svc = await this.findOne(id);
    if (dto.categoryId && dto.categoryId !== svc.category.id) {
      const category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
      if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);
      svc.category = category;
    }
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.softDelete(id);
  }
}