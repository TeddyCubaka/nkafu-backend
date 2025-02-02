import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Entity extends BaseModel<'entity'> {
  constructor() {
    super('entity');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'description', verbose: 'description' },
    { proprety: 'abbreviation', verbose: 'abbreviation' },
    { proprety: 'isActive', verbose: 'est actif' },
  ];

  createForm: InputType[] = [
    { proprety: 'name', verbose: 'nom', type: 'text' },
    { proprety: 'description', verbose: 'description', type: 'text' },
    { proprety: 'abbreviation', verbose: 'abbreviation', type: 'text' },
    {
      proprety: 'children',
      verbose: 'entités enfants',
      type: 'children',
      isOptional: true,
    },
  ];

  updateForm: InputType[] = [
    ...this.createForm,
    { proprety: 'isActive', verbose: 'est actif', type: 'boolean' },
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
