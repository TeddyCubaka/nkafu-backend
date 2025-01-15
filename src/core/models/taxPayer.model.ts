import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from 'src/core/models/base';
import { randomUUID } from 'node:crypto';

export class TaxPayer extends BaseModel<'taxPayer'> {
  constructor() {
    super('taxPayer');
  }

  listColumns: ColumnType[] = [
    { proprety: 'uniqueId', verbose: 'ID unique' },
    { proprety: 'fullName', verbose: 'nom complet' },
    { proprety: 'mobile', verbose: 'téléphone' },
    { proprety: 'type.name', verbose: 'type' },
    { proprety: 'createdAt', verbose: 'créé le' },
  ];
  createForm: InputType[] = [
    { proprety: 'fullName', verbose: 'nom complet', type: 'text' },
    { proprety: 'mobile', verbose: 'téléphone', type: 'text' },
    {
      proprety: 'typeId',
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
