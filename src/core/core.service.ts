import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { prisma } from 'prisma/lib/prisma';

@Injectable()
export class CoreService {
  async loadMenu(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId, isActive: true, isDeleted: false },
      select: {
        id: true,
        isRoot: true,
        isStaff: true,
        role: {
          select: {
            roleActions: {
              select: { actionId: true, action: true },
            },
          },
        },
        userPrivileges: { select: { actionId: true, action: true } },
      },
    });

    if (!user) {
      return {
        code: 400,
        message:
          'Votre compte est non actif dans le système. Veuillez vous rassurer que vous avez toutes les permissions.',
      };
    }

    const menuSelectOptions = {
      id: true,
      name: true,
      icon: true,
      path: true,
      menuActions: {
        select: {
          id: true,
          action: {
            select: {
              id: true,
              name: true,
              path: true,
              method: true,
            },
          },
        },
      },
    };

    const userSuperAction = {
      list: false,
      create: false,
      change: false,
      delete: false,
    };

    const userPermissions = new Set<string>();

    const processActions = (actions: any[]) => {
      actions.forEach((action) => {
        if (action.action.path.includes('*/*')) {
          const [key] = action.action.path.split('/');
          userSuperAction[key] = true;
        }
        userPermissions.add(action.actionId);
      });
    };

    processActions(user.role?.roleActions || []);
    processActions(user.userPrivileges);

    const profileMenu = await prisma.menu.findMany({
      where: { name: 'profile' },
      select: menuSelectOptions,
    });

    if (!user.isStaff || userPermissions.size === 0) {
      return {
        code: 200,
        message: '1 ligne trouvée',
        data: [
          {
            id: randomUUID(),
            name: 'personnels',
            icon: 'userTie',
            path: '',
            actions: [
              {
                id: randomUUID(),
                name: 'agents',
                path: `/list/core/agent?userId=${user.id}`,
              },
            ],
          },
          ...profileMenu.map((menu) => ({
            id: menu.id,
            name: menu.name,
            icon: menu.icon,
            path: menu.path,
            actions: menu.menuActions.map((action) => ({
              id: action.action.id,
              name: action.action.name,
              path: action.action.path,
            })),
          })),
        ],
      };
    }

    const data = await prisma.menu.findMany({
      select: menuSelectOptions,
    });

    let userHasProfileMenu = false;

    let filteredData:any = user.isRoot
      ? data
      : data
          .map((menu) => {
            if (menu.name == 'profile') userHasProfileMenu = true;
            const filteredActions = menu.menuActions.filter((action) => {
              const pathAction = action.action.path.startsWith('/')
                ? action.action.path.split('/')[1]
                : action.action.path.split('/')[0];
              return (
                userSuperAction[pathAction] ||
                userPermissions.has(action.action.id)
              );
            });

            return {
              id: menu.id,
              name: menu.name,
              icon: menu.icon,
              path: menu.path,
              actions: filteredActions.map((action) => ({
                id: action.action.id,
                name: action.action.name,
                path: action.action.path,
              })),
            };
          })
          .filter((menu) => menu.actions.length > 0);

    if (userHasProfileMenu && !user.isRoot) {
      filteredData = [
        ...filteredData,
        ...profileMenu.map((menu) => ({
          id: menu.id,
          name: menu.name,
          icon: menu.icon,
          path: menu.path,
          actions: menu.menuActions.map((action) => ({
            id: action.action.id,
            name: action.action.name,
            path: action.action.path,
          })),
        })),
      ];
    }

    return {
      code: 200,
      message: `${filteredData.length} lignes trouvées`,
      data: filteredData,
    };
  }

  async loadStats(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          mail: true,
          mobile: true,
          isRoot: true,
          isActive: true,
          isStaff: true,
          isDeleted: true,
          role: {
            select: { id: true, name: true },
          },
          agent: {
            select: {
              _count: {
                select: {
                  operationInitializated: {
                    where: { status: 'CLOSED' },
                  },
                  operationClosed: {
                    where: { status: 'CLOSED' },
                  },
                  agentBusStops: true,
                  liquidations: {
                    where: { status: 'CLOSED' },
                  },
                  validatedLiquidations: {
                    where: { status: 'CLOSED' },
                  },
                },
              },
              wallets: {
                select: {
                  id: true,
                  solde: true,
                  canBeNegative: true,
                  currency: {
                    select: {
                      id: true,
                      symbol: true,
                    },
                  },
                },
              },
              organization: {
                select: {
                  _count: {
                    select: {
                      operations: {
                        where: { status: 'CLOSED' },
                      },
                      agents: true,
                    },
                  },
                  wallet: {
                    select: {
                      currency: { select: { formatKey: true } },
                      solde: true,
                    },
                  },
                  agents: {
                    select: {
                      _count: {
                        select: {
                          operationClosed: {
                            where: { status: 'CLOSED', action: 'TAXATION' },
                          },
                          liquidations: true,
                        },
                      },
                      liquidations: {
                        where: { status: 'CLOSED' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || !user.isActive || user.isDeleted) {
        return {
          code: 404,
          message: 'Utilisateur introuvable ou inactif.',
        };
      }

      let organisationOperations = 0;
      let organisationLiquidations = 0;
      let moneyEntry = 0;

      if (user.agent?.organization?.agents) {
        user.agent.organization.agents.forEach((agent) => {
          organisationOperations += agent._count?.operationClosed || 0;
          organisationLiquidations += agent._count?.liquidations || 0;
          moneyEntry += agent.liquidations
            .map((liquidation) => liquidation.amount)
            .reduce((accumulator, currentValue) => {
              return accumulator + currentValue;
            }, 0);
        });
      }

      const data: any = {
        ...user,
        agent: user.agent
          ? {
              ...user.agent,
              organization: user.agent.organization
                ? {
                    wallet: user.agent.organization.wallet,
                    monthlyEntry: moneyEntry,
                    _count: {
                      ...user.agent.organization._count,
                      taxations: organisationOperations,
                      liquidations: organisationLiquidations,
                    },
                  }
                : undefined,
            }
          : undefined,
      };

      if (!user.isStaff && data.agent?.organization) {
        delete data.agent.organization;
      }

      return {
        code: 200,
        message: 'Statistiques chargées avec succès.',
        data,
      };
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques :', error);
      return {
        code: 500,
        message:
          "Une erreur s'est produite lors du chargement des statistiques.",
      };
    }
  }
}
