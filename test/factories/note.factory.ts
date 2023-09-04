import { User } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class NoteFactory {

  constructor(private readonly prisma: PrismaService) {}

  randomInfo() {
    return {
      title: faker.lorem.word(),
      text: faker.hacker.phrase(), //strong password
    };
  }

  async persist(user: User) {
    const data = this.randomInfo();
    const result = await this.prisma.note.create({
        data: { ...data, user: { connect: { id: user.id } } },
      });
    return result;
  }
}
