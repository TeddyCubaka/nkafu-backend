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
    { proprety: 'name', verbose: 'nom' },
    { proprety: 'mail', verbose: 'adresse mail' },
    { proprety: 'mobile', verbose: 'mobile' },
    { proprety: 'isRoot', verbose: 'est root' },
    { proprety: 'isActive', verbose: 'actif' },
    {
      proprety: 'mustRenewPassword',
      verbose: 'doit renouveller son mot de passe',
    },
    { proprety: 'allowedDeviceNumber', verbose: 'nombre des devices max' },
    { proprety: 'role.name', verbose: 'rôle' },
  ];

  createForm: InputType[] = [
    { proprety: 'name', verbose: 'name', type: 'text' },
    { proprety: 'password', verbose: 'password', type: 'text' },
    { proprety: 'mail', verbose: 'mail', type: 'text' },
    { proprety: 'mobile', verbose: 'mobile', type: 'text' },
    { proprety: 'isRoot', verbose: 'isRoot', type: 'boolean' },
    { proprety: 'isActive', verbose: 'isActive', type: 'boolean' },
    {
      proprety: 'allowedDeviceNumber',
      verbose: 'nombre des devices max',
      type: 'number',
    },
    {
      proprety: 'roleId',
      verbose: 'roleId',
      type: 'select',
      endpoint: 'autocomplete/core/role',
      isOptional: true,
    },
    {
      proprety: 'userPrivileges',
      verbose: 'privilège',
      type: 'multi-select',
      endpoint: 'autocomplete/core/action',
    },
  ];

  updateForm: InputType[] = [
    ...this.createForm.filter((field) => field.proprety != 'password'),
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
        userPrivileges: data.userPrivileges.map(
          (privillege) => privillege.actionId,
        ),
      };
    };
}
