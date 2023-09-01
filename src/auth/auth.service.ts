import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private EXPIRATION_TIME = '7 days';

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    await this.usersService.create(signUpDto);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Email or password not valid.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Email or password not valid.');

    return this.createToken(user);
  }
  
  createToken(user: User) {
    const { id, email } = user;
    const token = this.jwtService.sign(
      { id, email },
      { expiresIn: this.EXPIRATION_TIME },
    );
    return { token };
  }
}
