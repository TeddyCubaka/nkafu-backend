import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';
import { Prisma } from '@prisma/client';
import { formatPrismaError } from 'src/utils/format-prisma-error';

export class Wallet extends BaseModel<'wallet'> {
  constructor() {
    super('wallet');
  }

  listColumns: ColumnType[] = [
    { property: 'agent.firstName', verbose: 'agent' },
    { property: 'solde', verbose: 'solde' },
    { property: 'currency.formatKey', verbose: 'device' },
    { property: 'canBeNegative', verbose: 'peut-être infrieur a zero' },
  ];
  createForm: InputType[] = [
    {
      property: 'agentId',
      verbose: 'agent',
      type: 'select',
      endpoint: 'autocomplete/core/agent',
    },
    {
      property: 'currencyId',
      verbose: 'device',
      type: 'select',
      endpoint: 'autocomplete/core/currency',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      label: `${line.solde}`,
      value: line.id,
    }));
  };
}
