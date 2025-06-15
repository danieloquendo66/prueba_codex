import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FilterUserDto } from './dto/filter-user.dto';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { TwilioService } from './twilio.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private twilioService: TwilioService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, telefono, ssn } = createUserDto;
    const emailExists = await this.findByEmail(email);
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    const telefonoExists = await this.usersRepository.findOneBy({ telefono });
    if (telefonoExists) {
      throw new ConflictException('Telephone number already exists');
    }
    const ssnExists = await this.usersRepository.findOneBy({ ssn });
    if (ssnExists) {
      throw new ConflictException('SSN already exists');
    }
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(filter: FilterUserDto = {}): Promise<User[]> {
    const qb = this.usersRepository.createQueryBuilder('user');
    if (filter.email) {
      qb.andWhere('user.email = :email', { email: filter.email });
    }
    if (filter.telefono) {
      qb.andWhere('user.telefono = :telefono', { telefono: filter.telefono });
    }
    if (filter.ssn) {
      qb.andWhere('user.ssn = :ssn', { ssn: filter.ssn });
    }
    if (filter.nombre) {
      qb.andWhere('user.nombre ILIKE :nombre', { nombre: `%${filter.nombre}%` });
    }
    if (filter.apellido) {
      qb.andWhere('user.apellido ILIKE :apellido', { apellido: `%${filter.apellido}%` });
    }
    return qb.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { email, telefono, ssn } = updateUserDto;
    const updateData: any = { ...updateUserDto };
    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    if (email && email !== user.email) {
      const emailExists = await this.findByEmail(email);
      if (emailExists && emailExists.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }
    if (telefono && telefono !== user.telefono) {
      const telefonoExists = await this.usersRepository.findOneBy({ telefono });
      if (telefonoExists && telefonoExists.id !== id) {
        throw new ConflictException('Telephone number already exists');
      }
    }
    if (ssn && ssn !== user.ssn) {
      const ssnExists = await this.usersRepository.findOneBy({ ssn });
      if (ssnExists && ssnExists.id !== id) {
        throw new ConflictException('SSN already exists');
      }
    }
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.softDelete(id);
  }
  /** Genera y envía un código de verificación SMS al teléfono del usuario */
  async sendPhoneVerificationCode(id: string): Promise<void> {
    const user = await this.findOne(id);
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.phoneVerificationCode = code;
    user.phoneVerificationCodeExpiresAt = expiresAt;
    await this.usersRepository.save(user);
    await this.twilioService.sendSms(
      user.telefono,
      `Tu código de verificación es: ${code}`,
    );
  }
  /** Verifica el código de SMS y marca el teléfono como verificado */
  async verifyPhoneCode(id: string, dto: VerifyPhoneDto): Promise<void> {
    const user = await this.findOne(id);
    const { code } = dto;
    if (!user.phoneVerificationCode || user.phoneVerificationCode !== code) {
      throw new UnauthorizedException('Invalid verification code');
    }
    if (!user.phoneVerificationCodeExpiresAt || user.phoneVerificationCodeExpiresAt < new Date()) {
      throw new UnauthorizedException('Verification code expired');
    }
    user.phoneVerified = true;
    user.phoneVerificationCode = null;
    user.phoneVerificationCodeExpiresAt = null;
    await this.usersRepository.save(user);
  }
}