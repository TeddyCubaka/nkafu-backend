import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const endponts = {
  core: [
    'action',
    'user',
    'userDevice',
    'organization',
    'role',
    'roleAction',
    'userPrivilege',
    'menu',
    'menuAction',
    'entity',
    'agent',
    'currency',
    'wallet',
    'recipe',
    'taxPayerType',
    'taxPayer',
    'possession',
    'operation',
    'transaction',
    'walletLiquidation',
    'activitySector',
    'busStop',
  ],
};

const methods: {
  method: string;
  verbose: string;
}[] = [
  { method: 'GET', verbose: '' },
  { method: 'POST', verbose: 'create a' },
  { method: 'PATCH', verbose: 'change a' },
  { method: 'DELETE', verbose: 'delete a' },
];

export const getAction = (method: string): string => {
  switch (method) {
    case 'GET':
      return 'list';
    case 'POST':
      return 'create';
    case 'PATCH':
      return 'change';
    case 'DELETE':
      return 'delete';
  }
};
async function saver() {
  for (let app in endponts) {
    endponts[app].map(async (model) => {
      for (let method of methods) {
        let name =
          model == 'action'
            ? `${method.verbose} permission`
            : `${method.verbose} ${model}`;
        const path = await prisma.action.upsert({
          where: {
            path_method: {
              method: method.method,
              path: `/${getAction(method.method)}/${app}/${model}`,
            },
          },
          update: {
            method: method.method,
            name: name,
            path: `/${getAction(method.method)}/${app}/${model}`,
          },
          create: {
            method: method.method,
            name: name,
            path: `/${getAction(method.method)}/${app}/${model}`,
          },
        });
        console.log(path.name);
      }
    });
  }
}

saver();
