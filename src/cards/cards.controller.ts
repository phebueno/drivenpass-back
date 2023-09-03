import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @User() user) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  findAll(@User() user) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user) {
    return this.cardsService.findOne(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}
