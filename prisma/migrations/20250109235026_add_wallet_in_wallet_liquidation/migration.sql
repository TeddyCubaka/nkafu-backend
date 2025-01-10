-- AddForeignKey
ALTER TABLE "WalletLiquidation" ADD CONSTRAINT "WalletLiquidation_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
