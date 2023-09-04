import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('cards')
@Controller('cards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({summary: "Create a new card."})
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Card created.' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "User's card title already in use.",
  })
  create(@Body() createCardDto: CreateCardDto, @User() user) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @ApiOperation({summary: "Get user's cards."})
  @ApiResponse({ status: HttpStatus.OK, description: 'Returned cards array.' })
  findAll(@User() user) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({summary: "Get user card by id."})
  @ApiParam({ name: 'id', description: "card's id", example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returned single card.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Card belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: string, @User() user) {
    return this.cardsService.findOne(+id, user);
  }

  @Delete(':id')
  @ApiOperation({summary: "Delete user card by id."})
  @ApiParam({ name: 'id', description: "card's id", example: 1 })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Deleted single card.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Card belongs to another user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential not found.',
  })
  remove(@Param('id', ParseIntPipe) id: string, @User() user) {
    return this.cardsService.remove(+id, user);
  }
}
