import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Action extends BaseModel<'action'> {
  constructor() {
    super('action');
  }

  listColumns: ColumnType[] = [
    { property: 'name', verbose: 'nom' },
    { property: 'path', verbose: 'path' },
    { property: 'method', verbose: 'methode' },
  ];
  createForm: InputType[] = [
    { property: 'name', verbose: 'name', type: 'text' },
    { property: 'path', verbose: 'path', type: 'text' },
    {
      property: 'method',
      verbose: 'method',
      type: 'select',
      options: [
        { label: 'VOIR', value: 'GET' },
        { label: 'CREER', value: 'POST' },
        { label: 'CHANGER', value: 'PATCH' },
        { label: 'SUPPRIMER', value: 'DELETE' },
      ],
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
