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

describe('Credentials (e2e)', () => {
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
      .post('/credentials')
      .send({
        title: 'Steam200000',
        username: 'pheru',
        password: 'senhasecreta',
        url: 'https://store.steampowered.com/',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({
      id: expect.any(Number),
      userId: expect.any(Number),
      title: 'Steam200000',
      username: 'pheru',
      password: expect.any(String),
      url: 'https://store.steampowered.com/',
    });
  });
  it('GET /credentials => should return array of credentials', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );
    const credentials = [
      await new CredentialFactory(prisma, cryptr).persist(user),
      await new CredentialFactory(prisma, cryptr).persist(user),
    ];

    const response = await request(app.getHttpServer())
      .get('/credentials')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(credentials);
  });

  it('GET /credentials/:id => should a single credential', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );
    const credential = await new CredentialFactory(prisma, cryptr).persist(
      user,
    );

    const response = await request(app.getHttpServer())
      .get(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(credential);
  });

  it('DELETE /credentials/:id => should a single credential', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );
    const credential = await new CredentialFactory(prisma, cryptr).persist(
      user,
    );

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      ...credential,
      password: expect.any(String),
    });
  });
});
