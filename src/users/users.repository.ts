import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../auth/dto/signin.dto';

@Injectable()
export class UsersRepository {
  private SALT = 10;
  constructor(private readonly prisma: PrismaService) {}

  async create(userDto: CreateUserDto) {
    await this.prisma.user.create({
      data: {
        email: userDto.email,
        password: bcrypt.hashSync(userDto.password, this.SALT),
      },
    });
  }

  async getUserById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
