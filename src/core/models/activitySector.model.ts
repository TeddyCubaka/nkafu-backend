import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class ActivitySector extends BaseModel<'activitySector'> {
  constructor() {
    super('activitySector');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'description', verbose: 'description' },
  ];

  createForm: InputType[] = [
    { proprety: 'name', verbose: 'nom', type: 'text' },
    { proprety: 'description', verbose: 'description', type: 'text' },
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
