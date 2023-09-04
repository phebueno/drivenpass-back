import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'anon@gmail.com', description: "user's email" })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({ example: 'Ab@153ba', description: "user's strong password" })
  password: string;
}
