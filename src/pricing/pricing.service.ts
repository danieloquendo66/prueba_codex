import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { CalculatePriceDto } from './dto/calculate-price.dto';

@Injectable()
export class PricingService {
  private regionRates: Record<string, number> = {
    default: 1,
    NORTH: 1.1,
    SOUTH: 1.05,
  };

  constructor(private readonly servicesService: ServicesService) {}

  async calculate(dto: CalculatePriceDto) {
    const svc = await this.servicesService.findOne(dto.serviceId);
    const basePricePerUnit = Number(svc.basePrice);
    const baseTotal = basePricePerUnit * dto.area;

    const optionsDetail: Array<{
      optionId: string;
      name: string;
      extraPrice: number;
      total: number;
    }> = [];
    let optionsTotal = 0;

    if (dto.optionIds && dto.optionIds.length) {
      for (const optionId of dto.optionIds) {
        const opt = svc.options.find(o => o.id === optionId);
        if (!opt) throw new NotFoundException(`Option ${optionId} not found for service`);
        const extraPricePerUnit = Number(opt.extraPrice);
        const optTotal = extraPricePerUnit * dto.area;
        optionsDetail.push({
          optionId,
          name: opt.name,
          extraPrice: extraPricePerUnit,
          total: optTotal,
        });
        optionsTotal += optTotal;
      }
    }

    const factor = dto.region && this.regionRates[dto.region]
      ? this.regionRates[dto.region]
      : this.regionRates.default;
    const totalPrice = (baseTotal + optionsTotal) * factor;

    return {
      basePrice: baseTotal,
      area: dto.area,
      options: optionsDetail,
      region: dto.region,
      regionFactor: factor,
      totalPrice,
    };
  }
}