import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';

export class Organization extends BaseModel<'organization'> {
  constructor() {
    super('organization');
  }

  listColumns: ColumnType[] = [
    { proprety: 'photo', verbose: 'photo' },
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'wallet.solde', verbose: 'Montant dans la caisse' },
    { proprety: 'wallet.currency.formatKey', verbose: 'device' },
  ];
  createForm: InputType[] = [
    { proprety: 'photo', verbose: 'photo', type: 'file' },
    { proprety: 'name', verbose: 'name', type: 'text' }
  ];

  updateForm: InputType[] = [...this.createForm];

  postCreateSave: (data: Record<string, any>) => Promise<Record<string, any>> =
    async (data) => {
      try {
        const organization = await this.prisma.organization.update({
          where: { id: data.id },
          data: {
            wallet: {
              create: {
                currency: { connect: { formatKey: 'CDF' } },
                solde: 0,
              },
            },
          },
        });

        return organization;
      } catch (error) {
        console.log(error);
        return data;
      }
    };

  postUpdateSave: (
    id: string,
    data: Record<string, any>,
  ) => Promise<Record<string, any>> = async (id, data) => {
    try {
      if (data.walletId) return data;
      const organization = await this.prisma.organization.update({
        where: { id: data.id },
        data: {
          wallet: {
            create: {
              currency: { connect: { formatKey: 'CDF' } },
              solde: 0,
            },
          },
        },
      });

      return organization;
    } catch (error) {
      console.log(error);
      return data;
    }
  };

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
