import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { DocuSignService } from './docusign.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contract])],
  providers: [ContractsService, DocuSignService],
  controllers: [ContractsController],
})
export class ContractsModule {}