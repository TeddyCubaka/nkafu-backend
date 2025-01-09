import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Currency extends BaseModel<'currency'> {
  constructor() {
    super('currency');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'formatKey', verbose: 'abréviation' },
    { proprety: 'symbol', verbose: 'symbole' },
    { proprety: 'exchangeRate', verbose: 'taux de change' },
  ];

  createForm: InputType[] = [
    { verbose: 'nom', proprety: 'name', type: 'text' },
    { verbose: 'symbole', proprety: 'symbol', type: 'text' },
    { verbose: 'abréviation', proprety: 'formatproprety', type: 'text' },
    { verbose: 'taux de change', proprety: 'exchangeRate', type: 'number' },
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
