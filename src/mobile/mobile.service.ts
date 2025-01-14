import { Injectable } from '@nestjs/common';
import { prisma } from 'prisma/lib/prisma';

@Injectable()
export class MobileService {
  async getAgentInfo(id: string) {
    const agent = await prisma.agent.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        mobile: true,
        mail: true,
        address: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
        operationClosed: {
          take: 2,
          orderBy: { createdAt: { sort: 'desc' } },
          select: {
            id: true,
            recipe: {
              select: {
                id: true,
                name: true,
                pricing: true,
                currency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                    formatKey: true,
                    exchangeRate: true,
                  },
                },
                description: true,
                recipeType: true,
                generatingFact: true,
                activitySector: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            possession: {
              select: {
                id: true,
                uniqueNumber: true,
                type: true,
                taxPayer: true,
                createdAt: true,
              },
            },
            transactions: {
              include: {
                wallet: { include: { currency: true } },
              },
            },
          },
        },
        operationInitializated: {
          take: 2,
          orderBy: { createdAt: { sort: 'desc' } },
          select: {
            id: true,
            recipe: {
              select: {
                id: true,
                name: true,
                pricing: true,
                currency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                    formatKey: true,
                    exchangeRate: true,
                  },
                },
                description: true,
                recipeType: true,
                generatingFact: true,
                activitySector: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            possession: {
              select: {
                id: true,
                uniqueNumber: true,
                type: true,
                taxPayer: true,
                createdAt: true,
              },
            },
            transactions: {
              include: {
                wallet: { include: { currency: true } },
              },
            },
          },
        },
        liquidations: {
          take: 20,
          orderBy: { createdAt: { sort: 'desc' } },
        },
        entity: true,
        wallets: {
          include: { currency: true },
        },
      },
    });

    if (agent == null)
      return {
        code: 404,
        message: 'aucun agent.e trouvé.e',
      };
    return {
      code: 200,
      message: ' voici les informations sur cet agent',
      data: agent,
    };
  }
}
