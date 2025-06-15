import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServiceOptionsService } from '../service-options.service';
import { CreateServiceOptionDto } from '../dto/create-service-option.dto';
import { UpdateServiceOptionDto } from '../dto/update-service-option.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../users/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('service-options')
export class ServiceOptionsController {
  constructor(private readonly serviceOptionsService: ServiceOptionsService) {}

  @Post()
  create(@Body() dto: CreateServiceOptionDto) {
    return this.serviceOptionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.serviceOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceOptionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceOptionDto) {
    return this.serviceOptionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceOptionsService.remove(id);
  }
}