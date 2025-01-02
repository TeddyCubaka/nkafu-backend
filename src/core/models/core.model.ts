import { InputType } from 'src/types/models';
import { BaseModel, columnType } from './base';
import { Prisma, PrismaClient } from '@prisma/client';

export class Currency extends BaseModel<'currency'> {
  constructor() {
    super('currency');
  }

  listColumns: columnType[] = [
    { key: 'name', verbose: 'nom' },
    { key: 'symbol', verbose: 'symbole' },
    { key: 'formatKey', verbose: 'abréviation' },
    { key: 'exchangeRate', verbose: 'taux de change' },
  ];

  createForm: InputType[] = [
    { verbose: 'nom', key: 'name', type: 'text' },
    { verbose: 'symbole', key: 'symbol', type: 'text' },
    { verbose: 'abréviation', key: 'formatKey', type: 'text' },
    { verbose: 'taux de change', key: 'exchangeRate', type: 'number' },
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

export class User extends BaseModel<'currency'> {
  constructor() {
    super('currency');
  }

  listColumns: columnType[] = [
    { key: 'name', verbose: 'nom' },
    { key: 'mail', verbose: 'adresse mail' },
    { key: 'mobile', verbose: 'mobile' },
    { key: 'isRoot', verbose: 'est root' },
    { key: 'isActive', verbose: 'actif' },
    { key: 'mustRenewPassword', verbose: 'doit renouveller son mot de passe' },
    { key: 'allowedDeviceNumber', verbose: 'nombre des devices max' },
    { key: 'role.name', verbose: 'rôle' },
  ];

  createForm: InputType[] = [
    { key: 'name', verbose: 'name', type: 'text' },
    { key: 'password', verbose: 'password', type: 'text' },
    { key: 'mail', verbose: 'mail', type: 'text' },
    { key: 'mobile', verbose: 'mobile', type: 'text' },
    { key: 'isRoot', verbose: 'isRoot', type: 'text' },
    { key: 'isActive', verbose: 'isActive', type: 'text' },
    {
      key: 'roleId',
      verbose: 'roleId',
      type: 'select',
      endpoint: 'autocomplete/core/role',
    },
    {
      key: 'userPrivileges.name',
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
