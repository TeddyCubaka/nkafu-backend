import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const menuData: {
  icon: string;
  name: string;
  path?: string;
  actions: string[];
}[] = [
  {
    icon: 'dashboard',
    name: 'tableau de bord',
    path: '/',
    actions: [],
  },
  {
    icon: 'settings',
    name: 'settings',
    actions: [
      '/list/core/menu',
      '/list/core/action',
      '/list/core/role',
      '/list/core/user',
    ],
  },
  {
    icon: 'user',
    name: 'profile',
    actions: ['/change/auth/password', '/auth/logout'],
  },
];

async function Saver() {
  const menus = [];
  for (const menu of menuData) {
    let savedMenu = await prisma.menu
      .upsert({
        where: { name: menu.name },
        update: {
          isDefault: true,
          icon: menu.icon,
          name: menu.name,
          path: menu.path,
        },
        create: {
          isDefault: true,
          icon: menu.icon,
          name: menu.name,
          path: menu.path,
        },
      })
      .then((data) => data)
      .catch((err) => null);
    if (savedMenu == null) return;
    await prisma.menuAction.deleteMany({ where: { menuId: savedMenu.id } });
    const actions = menu.actions.map(async (path) => {
      let action = await prisma.action.findUnique({
        where: {
          name: `${path.split('/')[path.split('/').length - 1]}`,
        },
      });
      if (action == null) {
        action = await prisma.action.upsert({
          where: {
            path_method: {
              path: path,
              method: 'GET',
            },
          },
          update: {
            name: `${path.split('/')[path.split('/').length - 1]}`,
          },
          create: {
            name: `${path.split('/')[path.split('/').length - 1]}`,
            path: path,
            method: 'GET',
          },
        });
      }
      return await prisma.menuAction.create({
        data: {
          menu: { connect: { id: savedMenu.id } },
          action: { connect: { id: action.id } },
        },
      });
    });
    menus.push({ ...savedMenu, actions: actions });
  }
}

Saver();
