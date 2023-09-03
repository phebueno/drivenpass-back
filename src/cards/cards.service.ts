import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(cardDto: CreateCardDto, user: User) {
    const cryptr = this.cryptrService.getCryptrInstance();
    const encryptedPass = cryptr.encrypt(cardDto.password);
    const encryptedCVV = cryptr.encrypt(cardDto.cvv.toString());
    return await this.cardsRepository.create(
      { ...cardDto, password: encryptedPass, cvv: encryptedCVV },
      user,
    );
  }

  async findAll(user: User) {
    const cards = await this.cardsRepository.findAll(user.id)
    const cryptr = this.cryptrService.getCryptrInstance();
    cards.map((card) => {
      card.password = cryptr.decrypt(card.password);
      card.cvv = cryptr.decrypt(card.cvv);
    });
    return cards;
  }

  async findOne(id: number, user: User) {
    const card = await this.cardsRepository.findOne(id)
    if(!card) throw new NotFoundException("Card not found!")
    if(card.userId!==user.id) throw new ForbiddenException("Not card owner!");

    const cryptr = this.cryptrService.getCryptrInstance();
    const decryptedPass = cryptr.decrypt(card.password);
    const decryptedCVV = cryptr.decrypt(card.cvv);
    return { ...card, password: decryptedPass, cvv: decryptedCVV };
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
