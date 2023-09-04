import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { UserFactory } from '../factories/user.factory';
import * as jwt from 'jsonwebtoken';
import { NoteFactory } from '../factories/note.factory';

describe('Notes (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    //clean db
    await prisma.user.deleteMany();

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /notes => should create a note', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );

    const response = await request(app.getHttpServer())
      .post('/notes')
      .send({
        title: 'Linkedinho2',
        text: 'nota extra',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({
      id: expect.any(Number),
      title: 'Linkedinho2',
      text: 'nota extra',
      userId: user.id,
    });
  });

  it('GET /notes => should return array of notes', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );
    const notes = [
      await new NoteFactory(prisma).persist(user),
      await new NoteFactory(prisma).persist(user),
    ];

    const response = await request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(expect.arrayContaining([{
      id: expect.any(Number),
      title: expect.any(String),
      text: expect.any(String),
      userId: user.id,
    }]));
  });

  it('GET /notes/:id => should a single note', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );
    const note = await new NoteFactory(prisma).persist(user);

    const response = await request(app.getHttpServer())
      .get(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(note);
  });

  it('DELETE /notes/:id => should delete a note', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );
    const note = await new NoteFactory(prisma).persist(user);

    const response = await request(app.getHttpServer())
      .delete(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(note);
  });
});
