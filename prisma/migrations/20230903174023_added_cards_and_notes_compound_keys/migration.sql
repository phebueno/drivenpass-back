/*
  Warnings:

  - The primary key for the `cards` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "cards" DROP CONSTRAINT "cards_pkey",
ADD CONSTRAINT "cards_pkey" PRIMARY KEY ("userId", "title");

-- AlterTable
ALTER TABLE "notes" DROP CONSTRAINT "notes_pkey",
ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("userId", "title");
