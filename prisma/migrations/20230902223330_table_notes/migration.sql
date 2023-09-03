-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
