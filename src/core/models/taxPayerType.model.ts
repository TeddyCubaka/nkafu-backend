import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class TaxPayerType extends BaseModel<'taxPayerType'> {
  constructor() {
    super('taxPayerType');
  }

  listColumns: ColumnType[] = [
    { property: 'name', verbose: 'nom' },
    { property: 'isActive', verbose: 'activé' },
  ];

  createForm: InputType[] = [
    { property: 'name', verbose: 'nom', type: 'text' },
    { property: 'isActive', verbose: 'activé', type: 'boolean' },
  ];

  updateForm: InputType[] = [
    ...this.createForm.filter((field) => field.property != 'password'),
  ];

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      label: `${line.name}`,
    }));
  };
}
