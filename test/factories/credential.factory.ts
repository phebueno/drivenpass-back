import { User } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { CryptrService } from '../../src/utils/cryptr.service';

export class CredentialFactory {
  constructor(private readonly prisma: PrismaService, private readonly cryptrService: CryptrService) {}

  randomInfo() {
    return {
      title: faker.lorem.word(),
      username: faker.internet.userName(),
      password: faker.internet.password() + '@Aa1234', //strong password
      url: faker.internet.url(),
    };
  }

  async persist(user: User) {
    const data = this.randomInfo();
    const cryptr = this.cryptrService.getCryptrInstance();
    const result = await this.prisma.credential.create({
      data: { ...data, password: cryptr.encrypt(data.password), user: { connect: { id: user.id } } },
    });
    return {...result, password: data.password};
  }
}
