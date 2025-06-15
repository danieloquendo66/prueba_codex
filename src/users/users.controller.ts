import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { FilterUserDto } from './dto/filter-user.dto';
import { UsersService } from './users.service';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() filter: FilterUserDto) {
    return this.usersService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  /** Envía un código de verificación de teléfono por SMS */
  @Post(':id/phone/send-code')
  async sendPhoneCode(@Param('id') id: string, @Req() req) {
    if (req.user.userId !== id) {
      throw new ForbiddenException('No autorizado');
    }
    await this.usersService.sendPhoneVerificationCode(id);
    return { message: 'Verification code sent' };
  }
  /** Verifica el código SMS y marca teléfono como verificado */
  @Post(':id/phone/verify-code')
  async verifyPhoneCode(
    @Param('id') id: string,
    @Body() dto: VerifyPhoneDto,
    @Req() req,
  ) {
    if (req.user.userId !== id) {
      throw new ForbiddenException('No autorizado');
    }
    await this.usersService.verifyPhoneCode(id, dto);
    return { message: 'Phone number verified' };
  }
}
