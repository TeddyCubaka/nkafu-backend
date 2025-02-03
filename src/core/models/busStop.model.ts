import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class BusStop extends BaseModel<'busStop'> {
  constructor() {
    super('busStop');
  }

  listColumns: ColumnType[] = [
    { property: 'name', verbose: 'nom' },
    { property: 'entity', verbose: 'entité territoriale' },
  ];
  createForm: InputType[] = [
    { property: 'name', verbose: 'nom', type: 'text' },
    {
      property: 'entityId',
      verbose: 'entité territoriale',
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
