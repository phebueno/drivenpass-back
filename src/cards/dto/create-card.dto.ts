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
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  @Matches(/^[0-9]+$/, { message: 'Only digits (0-9) are allowed.' })
  cardDigits: string;

  @IsNotEmpty()
  @IsString()
  cardOwner: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  @Matches(/^[0-9]+$/, { message: 'Only digits (0-9) are allowed.' })
  cvv: string;

  @IsDateString()
  expDate: Date;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  isVirtual: boolean;

  @IsEnum(CardType)
  cardType: CardType;
}
