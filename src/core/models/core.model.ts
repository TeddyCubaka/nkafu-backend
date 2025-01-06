import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';
import { Prisma, PrismaClient } from '@prisma/client';

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
    verbose: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      verbose: line.name,
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
    { proprety: 'isRoot', verbose: 'isRoot', type: 'text' },
    { proprety: 'isActive', verbose: 'isActive', type: 'text' },
    {
      proprety: 'roleId',
      verbose: 'roleId',
      type: 'select',
      endpoint: 'autocomplete/core/role',
    },
    {
      proprety: 'userPrivileges.name',
      verbose: 'privilège',
      type: 'multi-select',
      endpoint: 'autocomplete/core/role',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  autocompleteData: (data: any[]) => {
    verbose: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      verbose: `${line.name} - (${line.mail})`,
    }));
  };
}

export class Menu extends BaseModel<'menu'> {
  constructor() {
    super('menu');
  }

  listColumns: ColumnType[] = [{ proprety: 'name', verbose: 'nom' }];

  createForm: InputType[] = [
    { proprety: 'name', verbose: 'name', type: 'text' },
    {
      proprety: 'menuActions',
      verbose: 'actions',
      type: 'multi-select',
      endpoint: 'autocomplete/core/action',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  preCreateSave = (data: Record<string, any>) => {
    return {
      name: data.name,
      menuActions: {
        create: data.menuActions.map((actionId) => ({ actionId })),
      },
    };
  };

  autocompleteData: (data: any[]) => {
    verbose: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      verbose: `${line.name}`,
    }));
  };
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
    verbose: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      verbose: `${line.name}`,
    }));
  };
}
