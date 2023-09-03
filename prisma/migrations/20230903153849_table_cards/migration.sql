-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DEBIT', 'CREDIT', 'BOTH');

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "cardDigits" TEXT NOT NULL,
    "cardOwner" TEXT NOT NULL,
    "cvv" INTEGER NOT NULL,
    "expDate" TIMESTAMP(3) NOT NULL,
    "password" INTEGER NOT NULL,
    "isVirtual" BOOLEAN NOT NULL,
    "cardType" "CardType" NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
