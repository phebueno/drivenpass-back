import { IsNotEmpty, IsString } from "class-validator";

export class EraseUserDto {   
    @IsNotEmpty()
    @IsString()
    password: string;
}
