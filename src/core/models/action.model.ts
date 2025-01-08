import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Action extends BaseModel<'action'> {
  constructor() {
    super('action');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'path', verbose: 'path' },
    { proprety: 'method', verbose: 'methode' },
  ];
  createForm: InputType[] = [
    { proprety: 'name', verbose: 'name', type: 'text' },
    { proprety: 'path', verbose: 'path', type: 'text' },
    {
      proprety: 'method',
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
