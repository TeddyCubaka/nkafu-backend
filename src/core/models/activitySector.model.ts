import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class ActivitySector extends BaseModel<'activitySector'> {
  constructor() {
    super('activitySector');
  }

  listColumns: ColumnType[] = [
    { property: 'name', verbose: 'nom' },
    { property: 'description', verbose: 'description' },
  ];

  createForm: InputType[] = [
    { property: 'name', verbose: 'nom', type: 'text' },
    { property: 'description', verbose: 'description', type: 'text' },
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
