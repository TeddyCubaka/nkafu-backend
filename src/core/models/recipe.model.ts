import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Recipe extends BaseModel<'recipe'> {
  constructor() {
    super('recipe');
  }

  listColumns: ColumnType[] = [
    { property: 'name', verbose: 'nom' },
    { property: 'pricing', verbose: 'prix' },
    { property: 'currency.formatKey', verbose: 'devise monétaire' },
    { property: 'entity.name', verbose: 'entité territoriale' },
    { property: 'description', verbose: 'description' },
    { property: 'recipeType', verbose: 'type' },
    { property: 'generatingFact', verbose: 'fait générateur' },
    { property: 'activitySector.name', verbose: "secteur d'activité" },
  ];
  createForm: InputType[] = [
    { property: 'name', verbose: 'nom', type: 'text' },
    { property: 'description', verbose: 'description', type: 'text' },
    { property: 'generatingFact', verbose: 'fait générateur', type: 'text' },
    { property: 'pricing', verbose: 'prix', type: 'number', isOptional: true },
    {
      property: 'currencyId',
      verbose: 'devise',
      type: 'select',
      endpoint: 'autocomplete/core/currency',
    },
    {
      property: 'entityId',
      verbose: 'entité territoriale',
      type: 'select',
      endpoint: 'autocomplete/core/entity',
    },
    {
      property: 'recipeType',
      verbose: 'type',
      type: 'select',
      options: [
        { label: 'TAX', value: 'TAX' },
        { label: 'IMPOT', value: 'IMPOT' },
        { label: 'REDEVANCE', value: 'REDEVANCE' },
      ],
    },
    {
      property: 'activitySectorId',
      verbose: "secteur d'activité",
      type: 'select',
      endpoint: 'autocomplete/core/activitySector',
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
