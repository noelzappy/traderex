/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('buy', 'sell');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "ScheduledTradeStatus" AS ENUM ('pending', 'executed', 'cancelled');

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" "TradeType" NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'open',
    "exitPrice" DOUBLE PRECISION,
    "percentageChange" DOUBLE PRECISION,
    "profitLoss" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_trades" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "riskRewardRatio" DOUBLE PRECISION NOT NULL,
    "status" "ScheduledTradeStatus" NOT NULL DEFAULT 'pending',
    "cancelAfter" TIMESTAMP(3),
    "proposedEntryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "scheduled_trades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "createdAt_idx" ON "trades"("createdAt");

-- CreateIndex
CREATE INDEX "symbol_idx" ON "trades"("symbol");

-- CreateIndex
CREATE INDEX "trades_type_idx" ON "trades"("type");

-- CreateIndex
CREATE INDEX "trades_userId_idx" ON "trades"("userId");

-- CreateIndex
CREATE INDEX "scheduled_trades_userId_idx" ON "scheduled_trades"("userId");

-- CreateIndex
CREATE INDEX "scheduled_trades_symbol_idx" ON "scheduled_trades"("symbol");

-- CreateIndex
CREATE INDEX "scheduled_trades_createdAt_idx" ON "scheduled_trades"("createdAt");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_trades" ADD CONSTRAINT "scheduled_trades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
