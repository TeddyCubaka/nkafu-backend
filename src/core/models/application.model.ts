import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Application extends BaseModel<'application'> {
  constructor() {
    super('application');
  }

  listColumns: ColumnType[] = [
    { property: 'icon', verbose: 'icone' },
    { property: 'name', verbose: 'nom' },
    { property: 'description', verbose: 'description' },
    { property: 'organization.name', verbose: 'organisation' },
  ];
  createForm: InputType[] = [
    { property: 'icon', verbose: 'icone', type: 'text' },
    { property: 'name', verbose: 'nom', type: 'text' },
    { property: 'description', verbose: 'description', type: 'text' },
    {
      property: 'organizationId',
      verbose: 'organisation',
      type: 'select',
      endpoint: 'list/core/organization',
    },
    {
      property: 'menus',
      verbose: 'menus',
      type: 'children',
      children: [
        { property: 'icon', verbose: 'icone', type: 'text' },
        { property: 'name', verbose: 'name', type: 'text' },
        {
          property: 'menuActions',
          verbose: 'actions',
          type: 'multi-select',
          endpoint: 'autocomplete/core/action',
        },
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
