import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class UserDevice extends BaseModel<'userDevice'> {
  constructor() {
    super('userDevice');
  }

  listColumns: ColumnType[] = [
    { proprety: 'deviceInnerId', verbose: "ID interne de l'appareil" },
    { proprety: 'user.name', verbose: 'utilisateur' },
    { proprety: 'deviceType', verbose: 'type de device' },
    { proprety: 'os', verbose: "système d'exploitation" },
    { proprety: 'browser', verbose: 'navigateur' },
    { proprety: 'ip', verbose: 'adresse IP' },
  ];
  createForm: InputType[] = [
    // { proprety: 'name', verbose: 'name', type: 'text' },
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
