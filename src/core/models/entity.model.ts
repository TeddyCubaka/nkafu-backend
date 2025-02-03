import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Entity extends BaseModel<'entity'> {
  constructor() {
    super('entity');
  }

  defaultFindManyFilter = {
    where: { parent: null },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: true,
                },
              },
            },
          },
        },
      },
    },
  };

  listColumns: ColumnType[] = [
    { property: 'name', verbose: 'nom' },
    { property: 'description', verbose: 'description' },
    { property: 'abbreviation', verbose: 'abbreviation' },
    { property: 'isActive', verbose: 'est actif' },
  ];

  createForm: InputType[] = [
    { property: 'name', verbose: 'nom', type: 'text' },
    { property: 'description', verbose: 'description', type: 'text' },
    { property: 'abbreviation', verbose: 'abbreviation', type: 'text' },
    {
      property: 'children',
      verbose: 'entités enfants',
      type: 'children',
      isOptional: true,
    },
  ];

  updateForm: InputType[] = [
    ...this.createForm,
    { property: 'isActive', verbose: 'est actif', type: 'boolean' },
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
