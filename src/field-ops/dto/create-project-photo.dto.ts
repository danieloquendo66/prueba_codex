import { IsUUID, IsUrl, IsOptional, IsString } from 'class-validator';

export class CreateProjectPhotoDto {
  @IsUUID()
  projectId: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;
}