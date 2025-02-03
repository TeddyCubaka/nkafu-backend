import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class UserDevice extends BaseModel<'userDevice'> {
  constructor() {
    super('userDevice');
  }

  listColumns: ColumnType[] = [
    { property: 'deviceInnerId', verbose: "ID interne de l'appareil" },
    { property: 'user.name', verbose: 'utilisateur' },
    { property: 'deviceType', verbose: 'type de device' },
    { property: 'os', verbose: "système d'exploitation" },
    { property: 'browser', verbose: 'navigateur' },
    { property: 'ip', verbose: 'adresse IP' },
  ];
  createForm: InputType[] = [
    // { property: 'name', verbose: 'name', type: 'text' },
  ];

  updateForm: InputType[] = [...this.createForm];

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      label: `${line.deviceInnerId} de ${line.user.name}`,
      value: line.id,
    }));
  };
}
