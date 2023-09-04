import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({summary: "Register a user."})
  @ApiBody({type: SignUpDto})
  @ApiResponse({status:HttpStatus.CREATED, description: "User created."})
  @ApiResponse({status:HttpStatus.CONFLICT, description: "Email already in use."})
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @ApiOperation({summary: "Authenticate a user."})
  @ApiBody({type: SignInDto})
  @ApiResponse({status:HttpStatus.CREATED, description: "User logged in."})
  @ApiResponse({status:HttpStatus.UNAUTHORIZED, description: "Wrong email or password."})
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
