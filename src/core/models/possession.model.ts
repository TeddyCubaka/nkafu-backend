import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from 'src/core/models/base';
import { randomUUID } from 'node:crypto';

export class Possession extends BaseModel<'possession'> {
  constructor() {
    super('possession');
  }

  listColumns: ColumnType[] = [
    { proprety: 'uniqueNumber', verbose: 'ID unique' },
    { proprety: 'type', verbose: 'type' },
    { proprety: 'taxPayer.fullName', verbose: 'redevable' },
  ];
  createForm: InputType[] = [
    { proprety: 'uniqueNumber', verbose: 'identifiant unique', type: 'text' },
    {
      proprety: 'type',
      verbose: 'type',
      type: 'select',
      options: [{ label: 'moto', value: 'MOTO' }],
    },
    {
      proprety: 'taxPayerId',
      verbose: 'redevable',
      type: 'select',
      endpoint: 'autocomplete/core/taxPayer',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  preCreateSave: (data: Record<string, any>) => Promise<Record<string, any>> =
    async (data) => {
      return {
        ...data,
      };
    };

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
