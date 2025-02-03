import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class AgentBusStop extends BaseModel<'agentBusStop'> {
  constructor() {
    super('agentBusStop');
  }

  listColumns: ColumnType[] = [
    { property: 'agent.firstName', verbose: "nom de l'agent" },
    { property: 'agent.lastName', verbose: "post-nom de l'agent" },
    { property: 'busStop.id', verbose: 'id' },
    { property: 'busStop.name', verbose: 'parking' },
    { property: 'busStop.entity.name', verbose: 'entité du parking' },
  ];
  createForm: InputType[] = [
    {
      property: 'agentId',
      verbose: 'name',
      type: 'select',
      endpoint: 'autocomplete/core/agent',
    },
    {
      property: 'busStopId',
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
