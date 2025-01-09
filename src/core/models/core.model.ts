import { Action } from './action.model';
import { ActivitySector } from './activitySector.model';
import { Agent } from './agent.model';
import { Currency } from './currency.model';
import { Entity } from './entity.model';
import { Menu } from './menu.model';
import { Organization } from './organization.model';
import { Possession } from './possession.model';
import { Recipe } from './recipe.model';
import { Role } from './role.model';
import { TaxPayer } from './taxPayer.model';
import { TaxPayerType } from './taxPayerType.model';
import { User } from './user.model';

export const coreConfig = {
  Agent,
  Action,
  Currency,
  Menu,
  Role,
  User,
  Organization,
  TaxPayerType,
  TaxPayer,
  Possession,
  ActivitySector,
  Entity,
  Recipe,
};
