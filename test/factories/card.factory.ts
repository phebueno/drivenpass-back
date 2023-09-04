import { CardType, User } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { CryptrService } from '../../src/utils/cryptr.service';

export class CardFactory {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptrService: CryptrService,
  ) {}

  randomInfo() {
    return {
      cardDigits: '1111222233334444',
      title: faker.lorem.word(),
      cardOwner: faker.finance.accountName(),
      cvv: faker.finance.creditCardCVV(),
      expDate: faker.date.future().toISOString(),
      password: faker.internet.password() + '@Aa1234',
      isVirtual: faker.datatype.boolean(),
      cardType: faker.helpers.enumValue(CardType),
    };
  }

  async persist(user: User) {
    const data = this.randomInfo();
    const cryptr = this.cryptrService.getCryptrInstance();
    const result = await this.prisma.card.create({
      data: {
        ...data,
        password: cryptr.encrypt(data.password),
        cvv: cryptr.encrypt(data.cvv),
        user: { connect: { id: user.id } },
      },
    });
    return { ...result, password: data.password, cvv: data.cvv, expDate: data.expDate.toString() };
  }
}
