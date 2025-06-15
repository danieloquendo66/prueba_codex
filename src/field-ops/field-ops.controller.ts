import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { FieldOpsService } from './field-ops.service';
import { CreateProjectPhotoDto } from './dto/create-project-photo.dto';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('field-ops')
export class FieldOpsController {
  constructor(private readonly service: FieldOpsService) {}

  @Post('photos')
  createPhoto(@Body() dto: CreateProjectPhotoDto) {
    return this.service.createPhoto(dto);
  }

  @Get('photos/:projectId')
  getPhotos(@Param('projectId') projectId: string) {
    return this.service.getPhotosByProject(projectId);
  }
  
  @Post('checkin')
  checkIn(@CurrentUser() user: any, @Body() dto: CheckInDto) {
    return this.service.checkIn(user.id, dto);
  }

  @Post('checkout/:id')
  checkOut(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CheckOutDto) {
    return this.service.checkOut(user.id, id, dto);
  }

  @Get('schedule')
  getSchedule(@CurrentUser() user: any) {
    return this.service.getSchedule(user.id);
  }

  @Get('schedule/:id')
  getScheduleById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.service.getScheduleById(user.id, id);
  }

  @Post('messages')
  sendMessage(@CurrentUser() user: any, @Body() dto: SendMessageDto) {
    return this.service.sendMessage(user.id, dto);
  }

  @Get('messages/:projectId')
  getMessages(@Param('projectId') projectId: string) {
    return this.service.getMessagesByProject(projectId);
  }
}