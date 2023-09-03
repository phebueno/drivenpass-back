import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { EraseUserDto } from './dto/erase-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userDto: CreateUserDto) {
    const { email } = userDto;
    const user = await this.usersRepository.getUserByEmail(email)
    if(user) throw new ConflictException("Email already in use.")

    return await this.usersRepository.create(userDto);
  }
  
  async getUserById(id: number){
    const user = await this.usersRepository.getUserById(id);
    if(!user) throw new NotFoundException("User not found!");
    return user;
  }

  async getUserByEmail(email: string){
    return await this.usersRepository.getUserByEmail(email);
  }

  async eraseUserAccount(eraseUserDto: EraseUserDto, user: User) {
    const valid = await bcrypt.compare(eraseUserDto.password, user.password);
    if (!valid) throw new UnauthorizedException('Wrong password.');
    return await this.usersRepository.eraseUserAccount(user.id)
  }
}
