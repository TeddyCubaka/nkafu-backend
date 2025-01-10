import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class WalletLiquidation extends BaseModel<'walletLiquidation'> {
  constructor() {
    super('walletLiquidation');
  }

  listColumns: ColumnType[] = [
    { proprety: 'agent.firstName', verbose: 'agent' },
    { proprety: 'amount', verbose: 'montant' },
    { proprety: 'wallet.currency.formatKey', verbose: 'device' },
    { proprety: 'startAt', verbose: 'debut' },
    { proprety: 'endAt', verbose: 'fin' },
    { proprety: 'status', verbose: 'statut' },
    { proprety: 'validatedByAgent.firstName', verbose: 'clôoturé par' },
  ];
  createForm: InputType[] = [
    { proprety: 'Voulez', verbose: 'name', type: 'text' },
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
