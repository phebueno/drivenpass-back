import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateNoteDto, user: User) {
    return this.prisma.note.create({
      data: { ...data, user: { connect: { id: user.id } } },
    });
  }

  findAll(userId: number) {
    return this.prisma.note.findMany({ where: { userId } });
  }

  findOne(id: number) {
    return this.prisma.note.findFirst({ where: { id } });
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }

  findByTitle(title: string, userId: number) {
    return this.prisma.note.findUnique({
      where: { userId_title: { title, userId } },
    });
  }
}
