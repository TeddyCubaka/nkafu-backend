import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Currency extends BaseModel<'currency'> {
  constructor() {
    super('currency');
  }

  listColumns: ColumnType[] = [
    { property: 'name', verbose: 'nom' },
    { property: 'formatKey', verbose: 'abréviation' },
    { property: 'symbol', verbose: 'symbole' },
    { property: 'exchangeRate', verbose: 'taux de change' },
  ];

  createForm: InputType[] = [
    { verbose: 'nom', property: 'name', type: 'text' },
    { verbose: 'symbole', property: 'symbol', type: 'text' },
    { verbose: 'abréviation', property: 'formatKey', type: 'text' },
    { verbose: 'taux de change', property: 'exchangeRate', type: 'number' },
  ];

  updateForm: InputType[] = this.createForm;

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
