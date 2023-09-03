import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCardDto, user: User) {
    return this.prisma.card.create({
      data: {
        ...data,
        expDate: new Date(data.expDate),
        user: { connect: { id: user.id } },
      },
    });
  }

  findAll(userId: number) {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
