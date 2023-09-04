import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export class UserFactory {
  private SALT = 10;

  constructor(private readonly prisma: PrismaService) {}

  randomInfo() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password() + '@Aa1234', //strong password
    };
  }

  async persist() {
    const user = this.randomInfo();
    const { id } = await this.prisma.user.create({
      data: {
        email: user.email,
        password: bcrypt.hashSync(user.password, this.SALT),
      },
    });
    return {id, ...user}; //will return decrypted password
  }
}
