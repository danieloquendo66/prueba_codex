import { IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  filename: string;

  @IsString()
  mimeType: string;

  @IsString()
  contentBase64: string;
}