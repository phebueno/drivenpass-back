/*
  Warnings:

  - The primary key for the `credentials` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_pkey",
ADD CONSTRAINT "credentials_pkey" PRIMARY KEY ("userId", "title");
