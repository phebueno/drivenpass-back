import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { UserFactory } from '../factories/user.factory';
import * as jwt from 'jsonwebtoken';
import { CryptrService } from '../../src/utils/cryptr.service';
import { CardFactory } from '../factories/card.factory';

describe('Cards (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cryptr: CryptrService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);
    cryptr = app.get(CryptrService);
    //clean db
    await prisma.user.deleteMany();

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /credentials => should create a credential', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );

    const response = await request(app.getHttpServer())
      .post('/cards')
      .send({
        cardDigits: '1111222233334444',
        title: 'cartao nubanko',
        cardOwner: 'FERNANDO CASSIMIRO BUENO GOMES',
        cvv: '999',
        expDate: '2018-05',
        password: 'senhasecreta',
        isVirtual: true,
        cardType: 'DEBIT',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({
      id: expect.any(Number),
      userId: expect.any(Number),
      cardDigits: '1111222233334444',
      title: 'cartao nubanko',
      cardOwner: 'FERNANDO CASSIMIRO BUENO GOMES',
      cvv: expect.any(String),
      expDate: expect.any(String),
      password: expect.any(String),
      isVirtual: true,
      cardType: 'DEBIT',
    });
  });

  it('GET /cards => should return array of cards', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );

    const cards = [
      await new CardFactory(prisma, cryptr).persist(user),
      await new CardFactory(prisma, cryptr).persist(user),
    ];

    const response = await request(app.getHttpServer())
      .get('/cards')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(cards);
  });
  it('GET /cards/:id => should return a single card', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );

   const card = await new CardFactory(prisma, cryptr).persist(user);

    const response = await request(app.getHttpServer())
      .get(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(card); 
  });
  it('DELETE /cards/:id => should delete a single card', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );

   const card = await new CardFactory(prisma, cryptr).persist(user);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({...card, cvv: expect.any(String), password: expect.any(String)}); 
  });
});
