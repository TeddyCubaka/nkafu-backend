import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Role extends BaseModel<'role'> {
  constructor() {
    super('role');
  }

  listColumns: ColumnType[] = [
    { property: 'id', verbose: 'pk' },
    { property: 'name', verbose: 'nom' },
  ];
  createForm: InputType[] = [
    { property: 'name', verbose: 'name', type: 'text' },
    {
      property: 'roleActions',
      verbose: 'permissions',
      type: 'multi-select',
      endpoint: 'autocomplete/core/action',
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

  preCreateSave = async (data: Record<string, any>) => {
    return {
      name: data.name,
      roleActions: {
        create: data.roleActions.map((actionId) => ({ actionId })),
      },
    };
  };

  preUpdateSave = async (id: string, data: Record<string, any>) => {
    await this.prisma.roleAction.deleteMany({ where: { roleId: id } });
    return {
      name: data.name,
      roleActions: {
        create: data.roleActions.map((actionId) => ({ actionId })),
      },
    };
  };

  async findById(id: number | string, query?: any): Promise<any | null> {
    query.where = { ...query['where'], id: id, isDeleted: false };
    query.include = {
      ...query['include'],
      roleActions: { include: { action: true } },
    };
    let data = await this.model.findUnique({
      ...query,
    });
    if (data == null) return data;
    data = {
      ...data,
      roleActions: data.roleActions.map((data) => data.action.id),
    };

    data.roleActions = [...new Set(data.roleActions)];
    return data;
  }
}
