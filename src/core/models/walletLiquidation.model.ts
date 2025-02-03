import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';
import { Prisma } from '@prisma/client';
import { formatPrismaError } from 'src/utils/format-prisma-error';
import { NotFoundException } from '@nestjs/common';

export class WalletLiquidation extends BaseModel<'walletLiquidation'> {
  constructor() {
    super('walletLiquidation');
  }

  listColumns: ColumnType[] = [
    { property: 'agent.firstName', verbose: 'agent' },
    { property: 'amount', verbose: 'montant' },
    { property: 'wallet.currency.formatKey', verbose: 'device' },
    { property: 'startAt', verbose: 'debut' },
    { property: 'endAt', verbose: 'fin' },
    { property: 'status', verbose: 'statut' },
    { property: 'validatedByAgent.firstName', verbose: 'clôoturé par' },
  ];
  createForm: InputType[] = [
    {
      property: 'confirmation',
      verbose: 'Voulez-vous faire une liquidation ?',
      type: 'select',
      options: [
        { label: 'OUI', value: 'true' },
        { label: 'NON', value: 'false' },
      ],
    },
  ];

  updateForm: InputType[] = [
    {
      property: 'confirmation',
      verbose: 'Valider la liquidation ?',
      type: 'select',
      options: [
        { label: 'OUI', value: 'true' },
        { label: 'NON', value: 'false' },
      ],
    },
  ];

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      label: `${line.name}`,
      value: line.id,
    }));
  };

  preCreateSave: (
    data: Record<string, any>,
  ) => Promise<
    Prisma.XOR<
      Prisma.WalletLiquidationCreateInput,
      Prisma.WalletLiquidationUncheckedCreateInput
    >
  > = async (data: {
    confirmation: 'true' | 'false';
    createdByUserId: string;
  }) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.createdByUserId,
        isDeleted: false,
        agent: { isNot: null },
      },
      include: {
        agent: {
          include: {
            wallets: true,
            operationInitializated: {
              where: {
                isClosed: true,
              },
              orderBy: { createdAt: { sort: 'desc' } },
            },
            liquidations: {
              where: { status: 'PENDING' },
              orderBy: { createdAt: { sort: 'desc' } },
            },
          },
        },
      },
    });

    if (user == null) {
      throw new Error("vous n'êtes pas eligible à cette fonctionnalité");
    }

    if (user.agent.wallets.length == 0) {
      throw new Error("vous n'avez aucun porte-feuille à liquider");
    }

    if (user.agent.wallets[0].solde < 100) {
      throw new Error('Votre balance est trop faible pour la liquidation');
    }

    if (user.agent.liquidations.length > 0) {
      throw new Error(
        'Vous avez une autre liquidation en attente. Attendez la validation',
      );
    }

    let startAt = new Date().toISOString();
    if (user.agent.operationInitializated.length > 0) {
      startAt = new Date(
        user.agent.operationInitializated[0].createdAt,
      ).toISOString();
    }

    const status = data.confirmation == 'true' ? 'PENDING' : 'REJECTED';

    return {
      amount: user.agent.wallets[0].solde,
      startAt,
      endAt: '',
      status: status,
      agent: { connect: { id: user.agent.id } },
      wallet: { connect: { id: user.agent.wallets[0].id } },
      createdBy: { connect: { id: data.createdByUserId } },
    };
  };

  preUpdateSave: (
    id: string,
    data: Record<string, any>,
  ) => Promise<
    Prisma.XOR<
      Prisma.WalletLiquidationUpdateInput,
      Prisma.WalletLiquidationUncheckedUpdateInput
    >
  > = async (
    id: string,
    data: {
      confirmation: 'true' | 'false';
      updatedByUserId: string;
    },
  ) => {
    const liquidation = await this.prisma.walletLiquidation.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        agent: { select: { organization: true } },
      },
    });

    if (liquidation == null || liquidation.agent == null) {
      throw new NotFoundException(
        'liquidation non trouvé ou invalide dans le système',
      );
    }

    if (liquidation.status !== 'PENDING') {
      throw new Error('Cette liquidation est déjà validé');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: data.updatedByUserId,
        isDeleted: false,
      },
      include: {
        agent: {
          include: { wallets: true, organization: true },
        },
      },
    });

    if (user == null) {
      throw new Error("vous n'êtes pas eligible à cette fonctionnalité");
    }

    if (!user.agent?.organization || user.agent?.organization == null) {
      throw new Error(
        "vous n'appartenez à aucune organisation pour effectuer une liquidation",
      );
    }

    if (user.agent.organization.id !== liquidation.agent.organization.id) {
      throw new Error(
        "vous n'appartenez à la même organisation que cette liquidation pour la valider",
      );
    }

    const status = data.confirmation == 'true' ? 'CLOSED' : 'REJECTED';
    return {
      updatedByUserId: data.updatedByUserId,
      status: status,
      endAt: new Date().toISOString(),
      validatedByAgentId: user.agent.id,
    };
  };

  postUpdateSave: (
    id: string,
    data: Record<string, any>,
  ) => Promise<Record<string, any>> = async (id, data) => {
    try {
      const liquidation = await this.prisma.walletLiquidation.findUnique({
        where: {
          id,
          isDeleted: false,
        },
        include: {
          agent: { select: { organization: true } },
        },
      });

      if (liquidation == null) return data;

      const user = await this.prisma.user.findUnique({
        where: {
          id: data.createdByUserId,
          isDeleted: false,
          agent: { isNot: null },
        },
        include: {
          agent: {
            include: {
              wallets: true,
              organization: { include: { wallet: true } },
            },
          },
        },
      });
      if (user == null) return data;
      if (user.agent.wallets.length == 0) {
        await this.prisma.walletLiquidation.update({
          where: { id: id },
          data: { status: 'REJECTED' },
        });

        throw new Error(
          "L'agent qui a demandé cette liquidation n'a aucun portefeuille disponible",
        );
      }

      const newSolde = user.agent.wallets[0].solde - liquidation.amount;
      if (newSolde < 0)
        throw new Error(
          "le disponible dans la balance n'est pas suffisant pour faire cette liquidation",
        );
      const operation = await this.prisma.operation.create({
        data: {
          initByAgent: { connect: { id: user.agent.id } },
          organization: {
            connect: { id: user.agent.organizationId },
          },
          closedByAgent: { connect: { id: user.agent.id } },
          status: 'CLOSED',
          paiementStatus: 'SUCCESS',
          action: 'LIQUIDATION',
          totalAmount: liquidation.amount,
          paiedAmount: liquidation.amount,
          isClosed: true,
          transactions: {
            create: [
              {
                amount: liquidation.amount,
                operationStatus: 'CLOSED',
                walletId: user.agent.wallets[0].id,
                paiemendStatus: 'SUCCESS',
                transactionType: 'DEBIT',
              },
              {
                amount: liquidation.amount,
                operationStatus: 'CLOSED',
                walletId: user.agent.organization.walletId,
                paiemendStatus: 'SUCCESS',
                transactionType: 'CREDIT',
              },
            ],
          },
        },
      });

      await this.prisma.organization
        .update({
          where: { id: user.agent.organizationId },
          data: {
            wallet: {
              update: {
                solde:
                  user.agent.organization.wallet.solde + liquidation.amount,
              },
            },
          },
        })
        .catch(async (error) => {
          await this.prisma.operation.update({
            where: { id: operation.id },
            data: {
              status: 'REJECTED',
              paiementStatus: 'FAILED',
              transactions: {
                updateMany: {
                  where: { operationId: operation.id },
                  data: {
                    paiemendStatus: 'FAILED',
                  },
                },
              },
            },
          });
        });

      await this.prisma.wallet
        .update({
          where: { id: user.agent.wallets[0].id },
          data: {
            solde: newSolde,
          },
        })
        .catch(async (error) => {
          await this.prisma.operation.update({
            where: { id: operation.id },
            data: {
              status: 'REJECTED',
              paiementStatus: 'FAILED',
              transactions: {
                updateMany: {
                  where: { operationId: operation.id },
                  data: {
                    paiemendStatus: 'FAILED',
                  },
                },
              },
            },
          });
          throw error.message;
        });

      return data;
    } catch (err) {
      await this.prisma.walletLiquidation.update({
        where: { id },
        data: { status: 'REJECTED' },
      });

      const error = formatPrismaError(err);
      return error;
    }
  };
}
