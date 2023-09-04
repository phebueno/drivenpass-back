import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class SignInDto{
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'anon@gmail.com', description: "user's email" })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'Ab@153ba', description: "user's strong password" })
    password: string;
}