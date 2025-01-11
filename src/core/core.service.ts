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

    processActions(user.role.roleActions);
    processActions(user.userPrivileges);

    if (!user.isStaff || userPermissions.size === 0) {
      const profileMenu = await prisma.menu.findMany({
        where: { name: 'profile' },
        select: menuSelectOptions,
      });

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

    const filteredData = user.isRoot
      ? data
      : data
          .map((menu) => {
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

    return {
      code: 200,
      message: `${filteredData.length} lignes trouvées`,
      data: filteredData,
    };
  }

  async loadStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
