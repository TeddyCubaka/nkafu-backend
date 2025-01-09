-- CreateTable
CREATE TABLE "AgentBusStop" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "busStopId" TEXT NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,
    "updatedByUserId" TEXT,
    "createdByUserId" TEXT,

    CONSTRAINT "AgentBusStop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentBusStop_id_key" ON "AgentBusStop"("id");

-- AddForeignKey
ALTER TABLE "AgentBusStop" ADD CONSTRAINT "AgentBusStop_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentBusStop" ADD CONSTRAINT "AgentBusStop_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentBusStop" ADD CONSTRAINT "AgentBusStop_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentBusStop" ADD CONSTRAINT "AgentBusStop_busStopId_fkey" FOREIGN KEY ("busStopId") REFERENCES "BusStop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
