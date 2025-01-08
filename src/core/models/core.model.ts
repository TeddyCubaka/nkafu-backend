import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';
import { Prisma, PrismaClient } from '@prisma/client';
import { Utils } from 'src/utils/utils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class Currency extends BaseModel<'currency'> {
  constructor() {
    super('currency');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'symbol', verbose: 'symbole' },
    { proprety: 'formatproprety', verbose: 'abréviation' },
    { proprety: 'exchangeRate', verbose: 'taux de change' },
  ];

  createForm: InputType[] = [
    { verbose: 'nom', proprety: 'name', type: 'text' },
    { verbose: 'symbole', proprety: 'symbol', type: 'text' },
    { verbose: 'abréviation', proprety: 'formatproprety', type: 'text' },
    { verbose: 'taux de change', proprety: 'exchangeRate', type: 'number' },
  ];

  updateForm: InputType[] = this.createForm;

  data = new PrismaClient().currency.findMany();

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      label: line.name,
    }));
  };
}

export class User extends BaseModel<'user'> {
  constructor() {
    super('user');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'mail', verbose: 'adresse mail' },
    { proprety: 'mobile', verbose: 'mobile' },
    { proprety: 'isRoot', verbose: 'est root' },
    { proprety: 'isActive', verbose: 'actif' },
    {
      proprety: 'mustRenewPassword',
      verbose: 'doit renouveller son mot de passe',
    },
    { proprety: 'allowedDeviceNumber', verbose: 'nombre des devices max' },
    { proprety: 'role.name', verbose: 'rôle' },
  ];

  createForm: InputType[] = [
    { proprety: 'name', verbose: 'name', type: 'text' },
    { proprety: 'password', verbose: 'password', type: 'text' },
    { proprety: 'mail', verbose: 'mail', type: 'text' },
    { proprety: 'mobile', verbose: 'mobile', type: 'text' },
    { proprety: 'isRoot', verbose: 'isRoot', type: 'boolean' },
    { proprety: 'isActive', verbose: 'isActive', type: 'boolean' },
    {
      proprety: 'allowedDeviceNumber',
      verbose: 'nombre des devices max',
      type: 'number',
    },
    {
      proprety: 'roleId',
      verbose: 'roleId',
      type: 'select',
      endpoint: 'autocomplete/core/role',
      isOptional: true,
    },
    {
      proprety: 'userPrivileges',
      verbose: 'privilège',
      type: 'multi-select',
      endpoint: 'autocomplete/core/action',
    },
  ];

  updateForm: InputType[] = [
    ...this.createForm.filter((field) => field.proprety != 'password'),
  ];

  preCreateSave = async (data: Record<string, any>) => {
    let verifyUser = await this.model.findFirst({
      where: { mobile: data.mobile },
    });

    if (verifyUser !== null)
      throw new Error('ce numero de telephone est deja utilisé');

    verifyUser = await this.model.findFirst({
      where: { mobile: data.mobile },
    });

    if (verifyUser !== null)
      throw new Error("ce nom d'utilisateur est deja prise");

    const utils = new Utils();

    const hashedPassword = await utils.hashPassword(data.password);

    return {
      ...data,
      password: hashedPassword,
      userPrivileges: {
        create: data.userPrivileges.map((actionId) => ({ actionId })),
      },
    };
  };

  preUpdateSave = async (id: string, data: Record<string, any>) => {
    await this.prisma.userPrivilege.deleteMany({ where: { userId: id } });
    return {
      ...data,
      userPrivileges: {
        create: data.userPrivileges.map((actionId) => ({ actionId })),
      },
    };
  };

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      label: `${line.name} - (${line.mail})`,
    }));
  };

  postFindOne: (data: Record<string, any>) => Promise<Record<string, any>> =
    async (data) => {
      delete data.password;
      return data;
    };
}

export class Menu extends BaseModel<'menu'> {
  constructor() {
    super('menu');
  }

  listColumns: ColumnType[] = [
    { proprety: 'icon', verbose: 'icone' },
    { proprety: 'isDefault', verbose: 'ajouté par default' },
    { proprety: 'name', verbose: 'nom' },
  ];

  createForm: InputType[] = [
    { proprety: 'icon', verbose: 'icone', type: 'text' },
    { proprety: 'name', verbose: 'name', type: 'text' },
    {
      proprety: 'menuActions',
      verbose: 'actions',
      type: 'multi-select',
      endpoint: 'autocomplete/core/action',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  preCreateSave = async (data: Record<string, any>) => {
    return {
      ...data,
      menuActions: {
        create: data.menuActions.map((actionId) => ({ actionId })),
      },
    };
  };

  preUpdateSave = async (id: string, data: Record<string, any>) => {
    await this.prisma.menuAction.deleteMany({ where: { menuId: id } });
    return {
      ...data,
      menuActions: {
        create: data.menuActions.map((actionId) => ({ actionId })),
      },
    };
  };

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      label: `${line.name}`,
    }));
  };

  async findById(id: number | string, query?: any): Promise<any | null> {
    query.where = { ...query['where'], id: id, isDeleted: false };
    query.include = {
      ...query['include'],
      menuActions: { include: { action: true } },
    };
    let data = await this.model.findUnique({
      ...query,
    });
    if (data == null) return data;
    data = {
      ...data,
      menuActions: data.menuActions.map((data) => data.action.id),
    };

    data.menuActions = [...new Set(data.menuActions)];
    return data;
  }
}

export class Action extends BaseModel<'action'> {
  constructor() {
    super('action');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'path', verbose: 'path' },
    { proprety: 'method', verbose: 'methode' },
  ];
  createForm: InputType[] = [
    { proprety: 'name', verbose: 'name', type: 'text' },
    { proprety: 'path', verbose: 'path', type: 'text' },
    {
      proprety: 'method',
      verbose: 'method',
      type: 'select',
      options: [
        { label: 'VOIR', value: 'GET' },
        { label: 'CREER', value: 'POST' },
        { label: 'CHANGER', value: 'PATCH' },
        { label: 'SUPPRIMER', value: 'DELETE' },
      ],
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      label: `${line.name}`,
      value: line.id,
    }));
  };
}

export class Role extends BaseModel<'role'> {
  constructor() {
    super('role');
  }

  listColumns: ColumnType[] = [
    { proprety: 'id', verbose: 'pk' },
    { proprety: 'name', verbose: 'nom' },
  ];
  createForm: InputType[] = [
    { proprety: 'name', verbose: 'name', type: 'text' },
    {
      proprety: 'roleActions',
      verbose: 'permissions',
      type: 'multi-select',
      endpoint: 'autocomplete/core/action',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      label: `${line.name}`,
      value: line.id,
    }));
  };

  preCreateSave = async (data: Record<string, any>) => {
    return {
      name: data.name,
      roleActions: {
        create: data.roleActions.map((actionId) => ({ actionId })),
      },
    };
  };

  preUpdateSave = async (id: string, data: Record<string, any>) => {
    await this.prisma.menuAction.deleteMany({ where: { menuId: id } });
    return {
      name: data.name,
      roleActions: {
        create: data.roleActions.map((actionId) => ({ actionId })),
      },
    };
  };

  async findById(id: number | string, query?: any): Promise<any | null> {
    query.where = { ...query['where'], id: id, isDeleted: false };
    query.include = {
      ...query['include'],
      roleActions: { include: { action: true } },
    };
    let data = await this.model.findUnique({
      ...query,
    });
    if (data == null) return data;
    data = {
      ...data,
      roleActions: data.roleActions.map((data) => data.action.id),
    };

    data.roleActions = [...new Set(data.roleActions)];
    return data;
  }
}

export class Agent extends BaseModel<'agent'> {
  constructor() {
    super('agent');
  }

  listColumns: ColumnType[] = [
    { proprety: 'firstName', verbose: 'nom' },
    { proprety: 'middleName', verbose: 'postnom' },
    { proprety: 'lastName', verbose: 'prenom' },
    { proprety: 'mobile', verbose: 'téléphone' },
    { proprety: 'address', verbose: 'adresse' },
    { proprety: 'userId', verbose: 'ID utilisateur' },
    { proprety: 'organization', verbose: 'organisation' },
  ];
  createForm: InputType[] = [
    { proprety: 'firstName', verbose: 'nom', type: 'text' },
    { proprety: 'middleName', verbose: 'postnom', type: 'text' },
    { proprety: 'lastName', verbose: 'prenom', type: 'text' },
    { proprety: 'mobile', verbose: 'téléphone', type: 'text' },
    { proprety: 'address', verbose: 'adresse', type: 'text' },
  ];

  updateForm: InputType[] = [...this.createForm];

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      label: `${line.name}`,
      value: line.id,
    }));
  };

  preCreateSave = async (data: Record<string, any>) => {
    return {
      ...data,
    };
  };

  postCreateSave = async (data) => {
    let updatedData = { ...data };
    try {
      const utils = new Utils();
      const createdUser = await utils.createUser({
        allowedDeviceNumber: 1,
        mobile: data?.mobile || null,
        name: data?.firstName || null,
        password: 'password12345',
      });
      if (createdUser.code > 399 || !('data' in createdUser)) {
        await this.model.update({
          where: { id: data.id },
          data: {
            meta: {
              error: {
                creation: [
                  { reason: 'adding user account', error: createdUser },
                ],
              },
            },
          },
        });
        updatedData.meta = {
          error: {
            creation: [{ reason: 'adding user account', error: createdUser }],
          },
        };
      } else {
        await this.model.update({ data: { userId: createdUser.data.id } });
        updatedData.meta = {
          message: 'le compte user a été ajouté par defaut',
        };
      }
    } catch (error) {
      await this.model.update({
        where: { id: data.id },
        data: {
          meta: {
            error: {
              creation: [
                {
                  reason: 'adding user account',
                  error: { message: error.message, target: error?.target },
                },
              ],
            },
          },
        },
      });
      updatedData.meta = {
        error: {
          creation: [{ reason: 'adding user account', error: error }],
        },
      };
    }

    return updatedData;
  };

  preUpdateSave = async (id: string, data: Record<string, any>) => {
    await this.prisma.menuAction.deleteMany({ where: { menuId: id } });
    return {
      ...data,
    };
  };
}
