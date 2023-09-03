import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';


@Controller('credentials')
@UseGuards(AuthGuard) //define para todas as rotas
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  findAll(@User() user) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string, @User() user) {
    return this.credentialsService.findOne(+id, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @User() user) {
    return this.credentialsService.remove(+id, user);
  }
}
