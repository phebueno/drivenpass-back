import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardsRepository } from './cards.repository';
import { CryptrService } from '../utils/cryptr.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, CardsRepository, CryptrService],
})
export class CardsModule {}
