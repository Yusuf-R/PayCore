/*
  Warnings:

  - A unique constraint covering the columns `[account_number]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_number` to the `wallets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "account_number" VARCHAR(10) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "wallets_account_number_key" ON "wallets"("account_number");
