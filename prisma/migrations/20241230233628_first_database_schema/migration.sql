-- CreateEnum
CREATE TYPE "PaiementStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "OperationStatus" AS ENUM ('PENDING', 'CLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "NamedEntity" AS ENUM ('PROVINCE', 'VILLE', 'COMMUNE', 'QUARTIER');

-- CreateEnum
CREATE TYPE "RecipeType" AS ENUM ('TAX', 'IMPOT', 'REDEVANCE');

-- CreateEnum
CREATE TYPE "PossessionType" AS ENUM ('MOTO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mail" TEXT,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL,
    "mustRenewPassword" BOOLEAN NOT NULL DEFAULT true,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAction" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "RoleAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPrivilege" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "UserPrivilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuAction" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "MenuAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "abbreviation" TEXT,
    "parentId" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "formatKey" TEXT NOT NULL,
    "exchangeRate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "solde" DOUBLE PRECISION NOT NULL,
    "agentId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "canBeNegative" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pricing" INTEGER NOT NULL,
    "parentId" TEXT NOT NULL,
    "entityId" TEXT,
    "currencyId" TEXT,
    "description" TEXT NOT NULL,
    "typeRecipeId" "RecipeType" NOT NULL,
    "generatingFact" TEXT,
    "activitySectorId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxPayerType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "TaxPayerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxPayer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "typeId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "TaxPayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Possession" (
    "id" TEXT NOT NULL,
    "uniqueNumber" TEXT NOT NULL,
    "type" "PossessionType" NOT NULL,
    "taxPayerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Possession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "possessionId" TEXT NOT NULL,
    "initByAgentId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "closedByAgentId" TEXT NOT NULL,
    "status" "OperationStatus" NOT NULL,
    "paiementStatus" "PaiementStatus" NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paiedAmount" DOUBLE PRECISION NOT NULL,
    "isClosed" BOOLEAN NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amout" DOUBLE PRECISION NOT NULL,
    "walletId" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "paiemendStatus" "PaiementStatus" NOT NULL,
    "operationStatus" "OperationStatus" NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_id_key" ON "Organization"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Action_id_key" ON "Action"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Action_name_key" ON "Action"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_key" ON "Role"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAction_id_key" ON "RoleAction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPrivilege_id_key" ON "UserPrivilege"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_id_key" ON "Menu"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuAction_id_key" ON "MenuAction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_id_key" ON "Entity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_name_key" ON "Entity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_id_key" ON "Agent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_fullName_key" ON "Agent"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_userId_key" ON "Agent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_id_key" ON "Currency"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_id_key" ON "Wallet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_id_key" ON "Recipe"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayerType_id_key" ON "TaxPayerType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayer_id_key" ON "TaxPayer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayer_uniqueId_key" ON "TaxPayer"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Possession_id_key" ON "Possession"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Possession_uniqueNumber_key" ON "Possession"("uniqueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_id_key" ON "Operation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAction" ADD CONSTRAINT "RoleAction_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAction" ADD CONSTRAINT "RoleAction_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAction" ADD CONSTRAINT "RoleAction_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAction" ADD CONSTRAINT "RoleAction_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrivilege" ADD CONSTRAINT "UserPrivilege_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrivilege" ADD CONSTRAINT "UserPrivilege_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrivilege" ADD CONSTRAINT "UserPrivilege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrivilege" ADD CONSTRAINT "UserPrivilege_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuAction" ADD CONSTRAINT "MenuAction_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuAction" ADD CONSTRAINT "MenuAction_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuAction" ADD CONSTRAINT "MenuAction_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuAction" ADD CONSTRAINT "MenuAction_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayerType" ADD CONSTRAINT "TaxPayerType_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayerType" ADD CONSTRAINT "TaxPayerType_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayer" ADD CONSTRAINT "TaxPayer_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TaxPayerType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayer" ADD CONSTRAINT "TaxPayer_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayer" ADD CONSTRAINT "TaxPayer_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Possession" ADD CONSTRAINT "Possession_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Possession" ADD CONSTRAINT "Possession_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Possession" ADD CONSTRAINT "Possession_taxPayerId_fkey" FOREIGN KEY ("taxPayerId") REFERENCES "TaxPayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_possessionId_fkey" FOREIGN KEY ("possessionId") REFERENCES "Possession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_initByAgentId_fkey" FOREIGN KEY ("initByAgentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_closedByAgentId_fkey" FOREIGN KEY ("closedByAgentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
