import { Controller, Post, Get, Delete, Body, Query, UseGuards } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly service: FileStorageService) {}

  @Post('upload')
  async upload(@Body() dto: UploadFileDto) {
    return this.service.uploadFile(dto);
  }

  @Get('url')
  async getUrl(@Query('key') key: string) {
    return this.service.getPresignedUrl(key);
  }

  @Delete('delete')
  async delete(@Query('key') key: string) {
    return this.service.deleteFile(key);
  }
}