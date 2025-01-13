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
    'agentBusStop'
  ],
};

const superActions: {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  name: string;
  path: string;
}[] = [
  {
    method: 'GET',
    name: 'peut tout lister',
    path: 'list/*/*',
  },
  {
    method: 'GET',
    name: 'peut tout créer',
    path: 'create/*/*',
  },
  {
    method: 'GET',
    name: 'peut tout mettre à jour',
    path: 'change/*/*',
  },
  {
    method: 'GET',
    name: 'peut tout suppri,er',
    path: 'delete/*/*',
  },
];

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

    superActions.map(async (action) => {
      await prisma.action.upsert({
        where: {
          path_method: {
            method: action.method,
            path: action.path,
          },
        },
        update: {
          method: action.method,
          path: action.path,
          name: action.name,
        },
        create: {
          method: action.method,
          path: action.path,
          name: action.name,
        },
      });
    });
  }
}

saver();
