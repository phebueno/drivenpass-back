import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCredentialDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Facebook', description: "credential's title" })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'facebookerson', description: "credential's username" })
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Aasdf12344', description: "credential's password" })
    password: string;

    @IsUrl()
    @IsNotEmpty()
    @ApiProperty({ example: 'https://www.facebook.com/', description: "credential's url" })
    url: string;
}
