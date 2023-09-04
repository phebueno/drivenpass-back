import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { UsersService } from './users.service';
import { EraseUserDto } from './dto/erase-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('erase')
  @ApiBody({type: EraseUserDto})
  @HttpCode(200)
  @ApiOperation({summary: "Delete user."})
  @ApiResponse({status:HttpStatus.OK, description: "User and all associated content deleted."})
  @ApiResponse({status:HttpStatus.UNAUTHORIZED, description: "Wrong password."})  
  create(@Body() eraseUserDto: EraseUserDto, @User() user) {
    return this.usersService.eraseUserAccount(eraseUserDto, user);
  }
}
