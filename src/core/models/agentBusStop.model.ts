import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class AgentBusStop extends BaseModel<'agentBusStop'> {
  constructor() {
    super('agentBusStop');
  }

  listColumns: ColumnType[] = [
    { proprety: 'agent.firstName', verbose: "nom de l'agent" },
    { proprety: 'agent.lastName', verbose: "post-nom de l'agent" },
    { proprety: 'busStop.id', verbose: 'id' },
    { proprety: 'busStop.name', verbose: 'parking' },
    { proprety: 'busStop.entity.name', verbose: 'entité du parking' },
  ];
  createForm: InputType[] = [
    {
      proprety: 'agentId',
      verbose: 'name',
      type: 'select',
      endpoint: 'autocomplete/core/agent',
    },
    {
      proprety: 'busStopId',
      verbose: 'path',
      type: 'select',
      endpoint: 'autocomplete/core/busStop',
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
