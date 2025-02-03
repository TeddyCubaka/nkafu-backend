import { PrismaClient } from '@prisma/client';

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

async function saver() {
  try {
    for (const menu of menuData) {
      // Upsert the menu
      const savedMenu = await prisma.menu.upsert({
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
      });

      console.log(savedMenu.name);

      // Delete existing menu actions
      await prisma.menuAction.deleteMany({ where: { menuId: savedMenu.id } });

      // Create new menu actions
      for (const path of menu.actions) {
        const actionName = path.split('/').pop() || '';

        // Upsert the action
        const action = await prisma.action.upsert({
          where: {
            path_method: {
              path: path,
              method: 'GET',
            },
          },
          update: {
            name: actionName,
          },
          create: {
            name: actionName,
            path: path,
            method: 'GET',
          },
        });

        // Create the menu action
        await prisma.menuAction.create({
          data: {
            menu: { connect: { id: savedMenu.id } },
            action: { connect: { id: action.id } },
          },
        });
      }
    }

    console.log('Menus and actions saved successfully.');
  } catch (error) {
    console.error('Error saving menus and actions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

saver();
