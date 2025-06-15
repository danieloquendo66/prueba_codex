import { IsString, IsUrl } from 'class-validator';

export class CreatePortfolioItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  url: string;
}