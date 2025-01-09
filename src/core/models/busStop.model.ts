import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class BusStop extends BaseModel<'busStop'> {
  constructor() {
    super('busStop');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'entity.name', verbose: 'entité territoriale' },
  ];
  createForm: InputType[] = [
    { proprety: 'name', verbose: 'nom', type: 'text' },
    {
      proprety: 'entityId',
      verbose: 'method',
      type: 'select',
      endpoint: 'autocomplete/core/entity',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

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
