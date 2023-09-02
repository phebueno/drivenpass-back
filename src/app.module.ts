import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CredentialsModule } from './credentials/credentials.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [AuthModule, PrismaModule, UsersModule, CredentialsModule],
})
export class AppModule {}
