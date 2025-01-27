import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Recipe extends BaseModel<'recipe'> {
  constructor() {
    super('recipe');
  }

  listColumns: ColumnType[] = [
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'pricing', verbose: 'prix' },
    { proprety: 'currency.formatKey', verbose: 'devise monétaire' },
    { proprety: 'entity.name', verbose: 'entité territoriale' },
    { proprety: 'description', verbose: 'description' },
    { proprety: 'recipeType', verbose: 'type' },
    { proprety: 'generatingFact', verbose: 'fait générateur' },
    { proprety: 'activitySector.name', verbose: "secteur d'activité" },
  ];
  createForm: InputType[] = [
    { proprety: 'name', verbose: 'nom', type: 'text' },
    { proprety: 'description', verbose: 'description', type: 'text' },
    { proprety: 'generatingFact', verbose: 'fait générateur', type: 'text' },
    { proprety: 'pricing', verbose: 'prix', type: 'number', isOptional: true },
    {
      proprety: 'currencyId',
      verbose: 'devise',
      type: 'select',
      endpoint: 'autocomplete/core/currency',
    },
    {
      proprety: 'entityId',
      verbose: 'entité territoriale',
      type: 'select',
      endpoint: 'autocomplete/core/entity',
    },
    {
      proprety: 'recipeType',
      verbose: 'type',
      type: 'select',
      options: [
        { label: 'TAX', value: 'TAX' },
        { label: 'IMPOT', value: 'IMPOT' },
        { label: 'REDEVANCE', value: 'REDEVANCE' },
      ],
    },
    {
      proprety: 'activitySectorId',
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
