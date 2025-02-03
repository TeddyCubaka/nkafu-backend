import { InputType } from 'src/types/models';
import { BaseModel, ColumnType } from './base';
import { Utils } from 'src/utils/utils';

export class User extends BaseModel<'user'> {
  constructor() {
    super('user');
  }

  defaultFindByIdFilter = {
    include: { userPrivileges: { include: { action: true } } },
  };

  listColumns: ColumnType[] = [
    { property: 'name', verbose: 'nom' },
    { property: 'mail', verbose: 'adresse mail' },
    { property: 'mobile', verbose: 'mobile' },
    { property: 'isRoot', verbose: 'est root' },
    { property: 'isActive', verbose: 'actif' },
    { property: 'isStaff', verbose: 'est un staff' },
    {
      property: 'mustRenewPassword',
      verbose: 'doit renouveller son mot de passe',
    },
    { property: 'allowedDeviceNumber', verbose: 'nombre des devices max' },
    { property: 'role.name', verbose: 'rôle' },
  ];

  createForm: InputType[] = [
    { property: 'name', verbose: 'name', type: 'text' },
    { property: 'password', verbose: 'password', type: 'text' },
    { property: 'mail', verbose: 'mail', type: 'text' },
    { property: 'mobile', verbose: 'mobile', type: 'text' },
    {
      property: 'isRoot',
      verbose: 'rendre super-utilisateur',
      type: 'select',
      options: [
        { label: 'oui', value: 'true' },
        { label: 'non', value: 'false' },
      ],
    },
    {
      property: 'isActive',
      verbose: 'rendre actif',
      type: 'select',
      options: [
        { label: 'oui', value: 'true' },
        { label: 'non', value: 'false' },
      ],
    },
    {
      property: 'isStaff',
      verbose: 'rendre staff',
      type: 'select',
      options: [
        { label: 'oui', value: 'true' },
        { label: 'non', value: 'false' },
      ],
    },
    {
      property: 'allowedDeviceNumber',
      verbose: 'nombre des devices max',
      type: 'number',
    },
    {
      property: 'roleId',
      verbose: 'roleId',
      type: 'select',
      endpoint: 'autocomplete/core/role',
      isOptional: true,
    },
    {
      property: 'userPrivileges',
      verbose: 'privilège',
      type: 'multi-select',
      endpoint: 'autocomplete/core/action',
    },
  ];

  updateForm: InputType[] = [
    ...this.createForm.filter((field) => field.property != 'password'),
  ];

  preCreateSave = async (data: Record<string, any>) => {
    let verifyUser = await this.model.findFirst({
      where: { mobile: data.mobile },
    });

    if (verifyUser !== null)
      throw new Error('ce numero de telephone est deja utilisé');

    verifyUser = await this.model.findFirst({
      where: { mobile: data.mobile },
    });

    if (verifyUser !== null)
      throw new Error("ce nom d'utilisateur est deja prise");

    const utils = new Utils();

    const hashedPassword = await utils.hashPassword(data.password);

    return {
      ...data,
      isRoot: data.isRoot == 'true' ? true : false,
      isActive: data.isActive == 'true' ? true : false,
      isStaff: data.isStaff == 'true' ? true : false,
      password: hashedPassword,
      userPrivileges: {
        create: data.userPrivileges.map((actionId) => ({ actionId })),
      },
    };
  };

  preUpdateSave = async (id: string, data: Record<string, any>) => {
    await this.prisma.userPrivilege.deleteMany({ where: { userId: id } });
    return {
      ...data,
      isRoot: data.isRoot == 'true' ? true : false,
      isActive: data.isActive == 'true' ? true : false,
      isStaff: data.isStaff == 'true' ? true : false,
      userPrivileges: {
        create: data.userPrivileges.map((actionId) => ({ actionId })),
      },
    };
  };

  autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[] = (currency) => {
    return currency.map((line) => ({
      value: line.id,
      label: `${line.name} - (${line.mail})`,
    }));
  };

  postFindOne: (data: Record<string, any>) => Promise<Record<string, any>> =
    async (data) => {
      delete data.password;
      return {
        ...data,
        isRoot: data.isRoot == true ? 'true' : 'false',
        isActive: data.isActive == true ? 'true' : 'false',
        isStaff: data.isStaff == true ? 'true' : 'false',
        userPrivileges: data.userPrivileges.map(
          (privillege) => privillege.actionId,
        ),
      };
    };
}
