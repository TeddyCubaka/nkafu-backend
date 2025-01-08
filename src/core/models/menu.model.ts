import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Menu extends BaseModel<'menu'> {
  constructor() {
    super('menu');
  }

  listColumns: ColumnType[] = [
    { proprety: 'icon', verbose: 'icone' },
    { proprety: 'isDefault', verbose: 'ajouté par default' },
    { proprety: 'name', verbose: 'nom' },
  ];

  createForm: InputType[] = [
    { proprety: 'icon', verbose: 'icone', type: 'text' },
    { proprety: 'name', verbose: 'name', type: 'text' },
    {
      proprety: 'menuActions',
      verbose: 'actions',
      type: 'multi-select',
      endpoint: 'autocomplete/core/action',
    },
  ];

  updateForm: InputType[] = [...this.createForm];

  preCreateSave = async (data: Record<string, any>) => {
    return {
      ...data,
      menuActions: {
        create: data.menuActions.map((actionId) => ({ actionId })),
      },
    };
  };

  preUpdateSave = async (id: string, data: Record<string, any>) => {
    await this.prisma.menuAction.deleteMany({ where: { menuId: id } });
    return {
      ...data,
      menuActions: {
        create: data.menuActions.map((actionId) => ({ actionId })),
      },
    };
  };

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      label: `${line.name}`,
    }));
  };

  async findById(id: number | string, query?: any): Promise<any | null> {
    query.where = { ...query['where'], id: id, isDeleted: false };
    query.include = {
      ...query['include'],
      menuActions: { include: { action: true } },
    };
    let data = await this.model.findUnique({
      ...query,
    });
    if (data == null) return data;
    data = {
      ...data,
      menuActions: data.menuActions.map((data) => data.action.id),
    };

    data.menuActions = [...new Set(data.menuActions)];
    return data;
  }
}
