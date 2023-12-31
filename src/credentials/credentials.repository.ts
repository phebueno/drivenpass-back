import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCredentialDto, user: User) {
    return this.prisma.credential.create({
      data: { ...data, user: { connect: { id: user.id } } },
    });
  }

  findAll(userId: number) {
    return this.prisma.credential.findMany({ where: { userId } });
  }

  findOne(id: number) {
    return this.prisma.credential.findFirst({ where: { id } });
  }

  remove(title: string, userId: number) {
    return this.prisma.credential.delete({
      where: { userId_title: { title, userId } },
    });
  }

  findByTitle(title: string, userId: number) {
    return this.prisma.credential.findUnique({
      where: { userId_title: { title, userId } },
    });
  }
}
