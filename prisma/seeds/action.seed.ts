import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const endponts = {
  core: [
    'User',
    'UserDevice',
    'Organization',
    'Action',
    'Role',
    'RoleAction',
    'UserPrivilege',
    'Menu',
    'MenuAction',
    'Entity',
    'Agent',
    'Currency',
    'Wallet',
    'Recipe',
    'TaxPayerType',
    'TaxPayer',
    'Possession',
    'Operation',
    'Transaction',
  ],
};

const methods: {
  method: string;
  verbose: string;
}[] = [
  { method: 'GET', verbose: 'see' },
  { method: 'POST', verbose: 'create' },
  { method: 'PATCH', verbose: 'change' },
  { method: 'DELETE', verbose: 'delete' },
];

async function saver() {
  for (let app in endponts) {
    endponts[app].map(async (model) => {
      for (let method of methods) {
        const path = await prisma.action.upsert({
          where: { name: `can ${method.verbose} ${model}` },
          update: {},
          create: {
            method: method.method,
            name: `can ${method.verbose} ${model}`,
            path: `/${app}/${model}`,
          },
        });
        console.log(path.name);
      }
    });
  }
}

saver();
