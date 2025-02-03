import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Organization extends BaseModel<'organization'> {
  constructor() {
    super('organization');
  }

  listColumns: ColumnType[] = [
    { property: 'photo', verbose: 'photo' },
    { property: 'name', verbose: 'nom' },
  ];
  createForm: InputType[] = [
    { property: 'photo', verbose: 'photo', type: 'file' },
    { property: 'name', verbose: 'name', type: 'text' },
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
