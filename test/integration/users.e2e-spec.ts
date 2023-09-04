import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { UserFactory } from '../factories/user.factory';
import * as jwt from 'jsonwebtoken';
import { CredentialFactory } from '../factories/credential.factory';
import { CryptrService } from '../../src/utils/cryptr.service';
import { NoteFactory } from '../factories/note.factory';
import { CardFactory } from '../factories/card.factory';

describe('Users (e2e)', () => {
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
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('POST /users/sign-up => should sign-up successfully', async () => {
    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({ email: 'fcbteste@gmail.com', password: 'bb@Aabc1' })
      .expect(HttpStatus.CREATED);

    const user = await prisma.user.findFirst({
      where: { email: 'fcbteste@gmail.com' },
    });

    expect(user).not.toBe(null);
  });

  it('POST /users/sign-in => should login successfully', async () => {
    const user = await new UserFactory(prisma).persist();
    const { status } = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send(user);

    expect(status).toBe(201);
  });
  it('POST /erase => should delete user account and all other info', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );
    await new NoteFactory(prisma).persist(user);
    await new CardFactory(prisma, cryptr).persist(user);
    await new CredentialFactory(prisma, cryptr).persist(user);

    const { status } = await request(app.getHttpServer())
      .post('/erase')
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(status).toBe(HttpStatus.OK);

  });
});
