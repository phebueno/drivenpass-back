import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    text: string;  
}

