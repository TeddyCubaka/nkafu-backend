import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from 'src/core/models/base';
import { OperationStatus, PaiementStatus, Prisma } from '@prisma/client';

export class Operation extends BaseModel<'operation'> {
  constructor() {
    super('operation');
  }

  listColumns: ColumnType[] = [
    { property: 'action', verbose: 'motif' },
    { property: 'recipe.name', verbose: 'recette' },
    { property: 'possession.uniqueNumber', verbose: 'ID de la possession' },
    { property: 'possession.type', verbose: 'appliqué sur une' },
    { property: 'possession.taxPayer.fullName', verbose: 'redevable' },
    {
      property: 'possession.taxPayer.uniqueId',
      verbose: 'matricule du redevable',
    },
    { property: 'initByAgent.firstName', verbose: 'initialisé par' },
    { property: 'busStop.name', verbose: 'initialisé par' },
    { property: 'closedByAgent.firstName', verbose: 'clôturé par' },
    { property: 'organization.name', verbose: 'organisation' },
    { property: 'status', verbose: "statut de l'opération" },
    { property: 'paiementStatus', verbose: 'statut de paiement' },
    { property: 'totalAmount', verbose: 'montant à payer' },
    { property: 'paiedAmount', verbose: 'montant payé' },
    { property: 'isClosed', verbose: 'est clôturé' },
  ];
  createForm: InputType[] = [
    {
      property: 'recipeId',
      verbose: 'recette',
      type: 'select',
      endpoint: 'autocomplete/core/recipe',
    },
    {
      property: 'possessionId',
      verbose: 'possession',
      type: 'select',
      endpoint: 'autocomplete/core/possession',
    },
    {
      property: 'busStopId',
      verbose: 'parking',
      type: 'select',
      endpoint: 'autocomplete/core/busStop',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  preCreateSave: (data: {
    recipeId: string;
    possessionId: string;
    createdByUserId: string;
    busStopId: string;
  }) => Promise<Record<string, any>> = async (data) => {
    const userAccount = await this.prisma.user.findUnique({
      where: { id: data.createdByUserId },
      include: {
        agent: {
          include: {
            wallets: {
              include: { currency: true },
            },
            organization: true,
          },
        },
      },
    });

    if (userAccount == null || userAccount.agent == null) {
      throw new Error(
        "Votre compte n'est pas correctement configurer pour faire cette action",
      );
    }
    if (userAccount.agent.wallets.length == 0) {
      throw new Error(
        "Vous n'avez aucun porte-feuille. Veuillez vous rendre au bureau pour qu'on vous en crées un",
      );
    }

    if (userAccount.agent.organization == null) {
      throw new Error(
        "Vous n'appartenez à aucune organisation pour faire des opérations dans notre système",
      );
    }
    const possession = await this.prisma.possession.findUnique({
      where: { id: data.possessionId },
      include: {
        taxPayer: true,
      },
    });
    if (possession == null) {
      throw new Error("Cette possession n'existe pas dans notre système");
    }

    if (possession.taxPayer == null) {
      throw new Error(
        "Cette possession n'appartient à personne. Veuillez identifier d'abord le possesseur",
      );
    }

    const recipe = await this.prisma.recipe.findUnique({
      where: { id: data.recipeId },
      select: { id: true, currency: true, pricing: true },
    });
    if (recipe == null) {
      throw new Error("Cette recette n'existe pas dans notre système");
    }

    if (
      recipe.pricing == null ||
      recipe.pricing < 50 ||
      recipe.currency == null
    ) {
      throw new Error(
        "Cette recette que vous essayer d'utiliser n'est pas correctement configurer pour initier une operation",
      );
    }
    return {
      recipeId: recipe.id,
      possessionId: possession.id,
      initByAgentId: userAccount.agent.id,
      organizationId: userAccount.agent.organization.id,
      status: OperationStatus.PENDING,
      paiementStatus: PaiementStatus.PENDING,
      totalAmount: recipe.pricing,
      paiedAmount: recipe.pricing,
      isClosed: false,
      busStopId: data.busStopId,
    };
  };

  postCreateSave: (data: {
    id: string;
    recipeId: string;
    possessionId: string;
    initByAgentId: string;
    organizationId: string;
    closedByAgentId: string | null;
    status: OperationStatus;
    paiementStatus: PaiementStatus;
    totalAmount: number;
    paiedAmount: number;
    isClosed: boolean;
    meta: Prisma.JsonValue;
    createdAt: Date | null;
    updatedAt: Date | null;
    isDeleted: boolean | null;
    updatedByUserId: string | null;
    createdByUserId: string | null;
  }) => Promise<Record<string, any>> = async (data) => {
    try {
      const agent = await this.prisma.agent.findUnique({
        where: { id: data.initByAgentId },
        include: {
          wallets: true,
        },
      });
      data = await this.prisma.operation.update({
        where: { id: data.id },
        data: {
          paiementStatus: 'SUCCESS',
          closedByAgent: { connect: { id: data.initByAgentId } },
          transactions: {
            create: {
              amount: data.paiedAmount,
              walletId: agent.wallets[0].id,
              paiemendStatus: 'SUCCESS',
              operationStatus: 'CLOSED',
              transactionType: 'CREDIT',
            },
          },
        },
      });

      await this.prisma.wallet.update({
        where: { id: agent.wallets[0].id },
        data: {
          solde: agent.wallets[0].solde + data.paiedAmount,
        },
      });
      data = await this.prisma.operation.update({
        where: { id: data.id },
        data: {
          status: 'CLOSED',
        },
        include: {
          transactions: true,
          initByAgent: {
            select: {
              wallets: true,
            },
          },
        },
      });
      return data;
    } catch (error) {
      data = await this.prisma.operation.update({
        where: { id: data.id },
        data: {
          status: 'CLOSED',
          paiementStatus: 'FAILED',
          transactions: {
            updateMany: {
              where: { operationId: data.id },
              data: {
                paiemendStatus: 'FAILED',
                operationStatus: 'REJECTED',
              },
            },
          },
        },
      });
      return data;
    }
  };

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      label: `${line.name}`,
      value: line.id,
    }));
  };
}
