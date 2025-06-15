import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { SignContractDto } from './dto/sign-contract.dto';
import { SendContractDto } from './dto/send-contract.dto';

@UseGuards(JwtAuthGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post(':id/send')
  async sendContract(
    @Param('id') id: string,
    @Body() dto: SendContractDto,
  ) {
    const { signingUrl } = await this.contractsService.send(
      id,
      dto.recipientName,
      dto.recipientEmail,
      dto.returnUrl,
    );
    return { signingUrl };
  }

  @Post()
  async create(@Body() dto: CreateContractDto) {
    const contract = await this.contractsService.create(dto);
    return { id: contract.id, htmlContent: contract.htmlContent };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Post(':id/sign')
  @HttpCode(HttpStatus.OK)
  async sign(
    @Param('id') id: string,
    @Body() dto: SignContractDto,
  ) {
    return this.contractsService.sign(id, dto);
  }
}