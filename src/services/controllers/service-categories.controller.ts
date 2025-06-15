import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServiceCategoriesService } from '../service-categories.service';
import { CreateServiceCategoryDto } from '../dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from '../dto/update-service-category.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../users/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(private readonly serviceCategoriesService: ServiceCategoriesService) {}

  @Post()
  create(@Body() dto: CreateServiceCategoryDto) {
    return this.serviceCategoriesService.create(dto);
  }

  @Get()
  findAll() {
    return this.serviceCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceCategoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceCategoryDto) {
    return this.serviceCategoriesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceCategoriesService.remove(id);
  }
}