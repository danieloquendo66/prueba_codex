import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from './entities/contract.entity';
import { DocuSignService } from './docusign.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { SignContractDto } from './dto/sign-contract.dto';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    private readonly docusignService: DocuSignService,
  ) {}

  async create(dto: CreateContractDto): Promise<Contract> {
    const { projectId } = dto;
    const date = new Date().toLocaleDateString();
    const html = `
      <html>
        <head><meta charset="utf-8"/><title>Contrato</title></head>
        <body>
          <h1>Contrato para Proyecto ${projectId}</h1>
          <p>Fecha de emisión: ${date}</p>
          <p>Este documento sirve como contrato digital para el proyecto.</p>
        </body>
      </html>
    `;
    const contract = this.contractsRepository.create({
      projectId,
      htmlContent: html,
      status: ContractStatus.DRAFT,
    });
    return this.contractsRepository.save(contract);
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({ where: { id } });
    if (!contract) {
      throw new NotFoundException(`Contract ${id} not found`);
    }
    return contract;
  }

  async sign(id: string, dto: SignContractDto): Promise<Contract> {
    const contract = await this.findOne(id);
    contract.signature = dto.signature;
    contract.status = ContractStatus.SIGNED;
    return this.contractsRepository.save(contract);
  }
  
  async send(
    id: string,
    recipientName: string,
    recipientEmail: string,
    returnUrl: string,
  ): Promise<{ signingUrl: string }> {
    const contract = await this.findOne(id);
    const { envelopeId, signingUrl } = await this.docusignService.createEnvelopeFromHtml(
      contract.htmlContent,
      recipientEmail,
      recipientName,
      returnUrl,
    );
    contract.envelopeId = envelopeId;
    contract.status = ContractStatus.SENT;
    await this.contractsRepository.save(contract);
    return { signingUrl };
  }
}