import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Organization extends BaseModel<'organization'> {
  constructor() {
    super('organization');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'photo', verbose: 'photo' },
  ];
  createForm: InputType[] = [
    { proprety: 'name', verbose: 'name', type: 'text' },
    { proprety: 'photo', verbose: 'photo', type: 'text' },
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
