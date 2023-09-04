import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

enum CardType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  BOTH = 'BOTH',
}

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'cartao nubank', description: "card's title" })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  @Matches(/^[0-9]+$/, { message: 'Only digits (0-9) are allowed.' })
  @ApiProperty({ example: '1111222233334444', description: "card's digits" })
  cardDigits: string;

  @IsNotEmpty()
  @IsString()
  cardOwner: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  @Matches(/^[0-9]+$/, { message: 'Only digits (0-9) are allowed.' })
  @ApiProperty({ example: '999', description: "card's security code" })
  cvv: string;

  @IsDateString()
  @ApiProperty({ example: '2028-05', description: "card's expiration date YY-MM" })
  expDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '@AVCsWhateverAlphanumericPass@f41!', description: "card's password" })
  password: string;

  @IsBoolean()
  @ApiProperty({ example: true, description: "card's password" })
  isVirtual: boolean;

  @IsEnum(CardType)
  @ApiProperty({ example: 'CREDIT', description: "card's type ('CREDIT' | 'DEBIT' | 'BOTH')" })
  cardType: CardType;
}
