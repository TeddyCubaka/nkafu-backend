import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class TaxPayerType extends BaseModel<'taxPayerType'> {
  constructor() {
    super('taxPayerType');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'isActive', verbose: 'activé' },
  ];

  createForm: InputType[] = [
    { proprety: 'name', verbose: 'nom', type: 'text' },
    { proprety: 'isActive', verbose: 'activé', type: 'boolean' },
  ];

  updateForm: InputType[] = [
    ...this.createForm.filter((field) => field.proprety != 'password'),
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
