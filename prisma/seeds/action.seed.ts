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

async function saver() {
  for (let app in endponts) {
    endponts[app].map(async (model) => {
      for (let method of methods) {
        const path = await prisma.action.upsert({
          where: { name: `${method.verbose} ${model}` },
          update: {},
          create: {
            method: method.method,
            name: `${method.verbose} ${model}`,
            path: `/${app}/${model}`,
          },
        });
        console.log(path.name);
      }
    });
  }
}

saver();
