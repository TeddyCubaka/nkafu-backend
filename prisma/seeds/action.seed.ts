import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const endponts = {
  core: [
    'user',
    'userDevice',
    'organization',
    'action',
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
        const path = await prisma.action.upsert({
          where: { name: `${method.verbose} ${model}` },
          update: {
            method: method.method,
            name: `${method.verbose} ${model}`,
            path: `/${getAction(method.method)}/${app}/${model}`,
          },
          create: {
            method: method.method,
            name: `${method.verbose} ${model}`,
            path: `/${getAction(method.method)}/${app}/${model}`,
          },
        });
        console.log(path.name);
      }
    });
  }
}

saver();
