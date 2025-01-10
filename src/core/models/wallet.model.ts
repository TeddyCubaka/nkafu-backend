import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';
import { Prisma } from '@prisma/client';
import { formatPrismaError } from 'src/utils/format-prisma-error';

export class Wallet extends BaseModel<'wallet'> {
  constructor() {
    super('wallet');
  }

  listColumns: ColumnType[] = [
    { proprety: 'agent.firstName', verbose: 'agent' },
    { proprety: 'solde', verbose: 'solde' },
    { proprety: 'currency.formatKey', verbose: 'device' },
    { proprety: 'canBeNegative', verbose: 'peut-être infrieur a zero' },
  ];
  createForm: InputType[] = [
    {
      proprety: 'agentId',
      verbose: 'agent',
      type: 'select',
      endpoint: 'autocomplete/core/agent',
    },
    {
      proprety: 'currencyId',
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
