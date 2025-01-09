import { Injectable } from '@nestjs/common';
import { prisma } from 'prisma/lib/prisma';

@Injectable()
export class CoreService {
  async loadMenu() {
    const data = await prisma.menu.findMany({
      select: {
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
      },
    });
    return {
      code: 200,
      message: `${data.length} lignes trouvées`,
      data: data.map((menu) => ({
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
    };
  }
}
