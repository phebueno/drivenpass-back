import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { UsersService } from './users.service';
import { EraseUserDto } from './dto/erase-user.dto';

@Controller('erase')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()  
  create(@Body() eraseUserDto: EraseUserDto, @User() user) {
    return this.usersService.eraseUserAccount(eraseUserDto, user);
  }
}
