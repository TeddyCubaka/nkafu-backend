import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';
import { Utils } from 'src/utils/utils';

export class Agent extends BaseModel<'agent'> {
  constructor() {
    super('agent');
  }

  listColumns: ColumnType[] = [
    { property: 'firstName', verbose: 'nom' },
    { property: 'middleName', verbose: 'postnom' },
    { property: 'lastName', verbose: 'prenom' },
    { property: 'mobile', verbose: 'téléphone' },
    { property: 'address', verbose: 'adresse' },
    { property: 'wallets.solde', verbose: 'porte-feuilles' },
    { property: 'user.mobile', verbose: 'user mobile' },
    { property: 'entity.name', verbose: 'territoire' },
    { property: 'organization.name', verbose: 'organisation' },
  ];
  createForm: InputType[] = [
    { property: 'firstName', verbose: 'nom', type: 'text' },
    { property: 'middleName', verbose: 'postnom', type: 'text' },
    { property: 'lastName', verbose: 'prenom', type: 'text' },
    { property: 'mobile', verbose: 'téléphone', type: 'text' },
    { property: 'address', verbose: 'adresse', type: 'text' },
    {
      property: 'entityId',
      verbose: 'territoire',
      type: 'select',
      endpoint: 'autocomplete/core/entity',
    },
    {
      property: 'agentBusStops',
      verbose: "parkings d'affectation",
      type: 'multi-select',
      endpoint: 'autocomplete/core/busStop',
    },
    {
      property: 'organizationId',
      verbose: 'organisation',
      type: 'select',
      endpoint: 'autocomplete/core/organization',
    },
  ];

  updateForm: InputType[] = [...this.createForm];
  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      label: `${line.firstName}-${line.lastName}`,
      value: line.id,
    }));
  };

  preCreateSave = async (data: Record<string, any>) => {
    return {
      ...data,
      agentBusStops: {
        create: data.agentBusStops.map((element: string) => ({
          busStopId: element,
        })),
      },
    };
  };

  postCreateSave = async (data) => {
    let updatedData = { ...data };
    try {
      const utils = new Utils();
      const createdUser = await utils.createUser({
        allowedDeviceNumber: 1,
        mobile: data?.mobile || null,
        name: `${data?.firstName}-${data.id}` || null,
        password: 'password12345',
        mustRenewPassword: true,
        mail: data.mail,
      });
      if ('data' in createdUser) {
        await this.prisma.agent.update({
          where: { id: data.id },
          data: {
            user: {
              connect: { id: createdUser.data.id },
            },
            wallets: {
              create: [
                {
                  solde: 0,
                  currency: { connect: { formatKey: 'CDF' } },
                  canBeNegative: false,
                },
              ],
            },
          },
        });
        updatedData.meta = {
          message: 'le compte user a été ajouté par defaut',
        };

        return updatedData;
      }
      await this.prisma.agent.update({
        where: { id: data.id },
        data: {
          meta: {
            error: {
              creation: [
                {
                  reason: "échec de l'ajout automatique du compte utilisateur",
                  error: createdUser,
                },
              ],
            },
          },
        },
      });
      updatedData.meta = {
        error: {
          creation: [
            {
              reason: "échec de l'ajout automatique du compte utilisateur",
              error: createdUser,
            },
          ],
        },
      };
    } catch (error) {
      await this.model.update({
        where: { id: data.id },
        data: {
          meta: {
            error: {
              creation: [
                {
                  reason: "échec de l'ajout automatique du compte utilisateur",
                  error: {
                    message: error.message,
                    target: error.meta?.target || error.meta?.cause,
                  },
                },
              ],
            },
          },
        },
      });
      updatedData.meta = {
        error: {
          creation: [
            {
              reason: "échec de l'ajout automatique du compte utilisateur",
              error: {
                message: error.message,
                target: error.meta?.target || error.meta?.cause,
              },
            },
          ],
        },
      };
    }

    return updatedData;
  };

  preUpdateSave = async (id: string, data: Record<string, any>) => {
    await this.prisma.agentBusStop.deleteMany({ where: { agentId: id } });
    return {
      ...data,
      agentBusStops: {
        create: data.agentBusStops.map((element: string) => ({
          busStopId: element,
        })),
      },
    };
  };

  postFindOne = async (data) => {
    return {
      ...data,
      agentBusStops: data.agentBusStops.map((busStop) => busStop.busStopId),
    };
  };

  async findById(id: number | string, query?: any): Promise<any | null> {
    query.where = { ...query['where'], id: id, isDeleted: false };
    query.include = {
      ...query['include'],
      wallets: { include: { currency: true } },
      user: true,
      agentBusStops: { include: { busStop: true } },
    };
    return await this.postFindOne(
      await this.model.findUnique({
        ...query,
      }),
    );
  }
}
