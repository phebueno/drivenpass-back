import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class EraseUserDto {   
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Abv1235@RAefa', description: "user's password" })
    password: string;
}
