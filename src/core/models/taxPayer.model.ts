import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from 'src/core/models/base';
import { randomUUID } from 'node:crypto';

export class TaxPayer extends BaseModel<'taxPayer'> {
  constructor() {
    super('taxPayer');
  }

  listColumns: ColumnType[] = [
    { property: 'uniqueId', verbose: 'ID unique' },
    { property: 'fullName', verbose: 'nom complet' },
    { property: 'mobile', verbose: 'téléphone' },
    { property: 'type.name', verbose: 'type' },
    { property: 'createdAt', verbose: 'créé le' },
  ];
  createForm: InputType[] = [
    { property: 'fullName', verbose: 'nom complet', type: 'text' },
    { property: 'mobile', verbose: 'téléphone', type: 'text' },
    {
      property: 'typeId',
      verbose: 'type',
      type: 'select',
      endpoint: 'autocomplete/core/taxPayerType',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  preCreateSave: (data: Record<string, any>) => Promise<Record<string, any>> =
    async (data) => {
      return {
        ...data,
        uniqueId: randomUUID(),
      };
    };

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      label: `${line.fullName}`,
      value: line.id,
    }));
  };
}
