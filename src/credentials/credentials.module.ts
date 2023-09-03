import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { AuthModule } from '../auth/auth.module';
import { CredentialsRepository } from './credentials.repository';
import { CryptrService } from '../utils/cryptr.service';

@Module({
  imports:[AuthModule],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository, CryptrService],
})
export class CredentialsModule {}
