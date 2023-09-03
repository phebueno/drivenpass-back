import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';
import { User } from '@prisma/client';
import { CryptrService } from '../utils/cryptr.service';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly cryptrService: CryptrService,
  ) {}

  create(cardDto: CreateCardDto, user: User) {
    const cryptr = this.cryptrService.getCryptrInstance();
    const encryptedPass = cryptr.encrypt(cardDto.password);
    const encryptedCVV = cryptr.encrypt(cardDto.cvv.toString());
    return this.cardsRepository.create(
      { ...cardDto, password: encryptedPass, cvv: encryptedCVV },
      user,
    );
  }

  findAll(user: User) {
    return this.cardsRepository.findAll(user.id);
  }

  findOne(id: number, user: User) {
    return this.cardsRepository.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
