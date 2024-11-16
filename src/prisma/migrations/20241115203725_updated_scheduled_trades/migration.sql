/*
  Warnings:

  - You are about to drop the column `cancelAfter` on the `scheduled_trades` table. All the data in the column will be lost.
  - You are about to drop the column `proposedEntryDate` on the `scheduled_trades` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "scheduled_trades" DROP COLUMN "cancelAfter",
DROP COLUMN "proposedEntryDate",
ADD COLUMN     "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "validUntil" TIMESTAMP(3);
