import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Importante!!', description: "note's title" })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'text text so much important text', description: "note's annotations" })
    text: string;  
}

