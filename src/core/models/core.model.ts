import { Action } from './action.model';
import { WalletLiquidation } from './walletLiquidation.model';
import { ActivitySector } from './activitySector.model';
import { Agent } from './agent.model';
import { BusStop } from './busStop.model';
import { Currency } from './currency.model';
import { Entity } from './entity.model';
import { Menu } from './menu.model';
import { Operation } from './operation.model';
import { Organization } from './organization.model';
import { Possession } from './possession.model';
import { Recipe } from './recipe.model';
import { Role } from './role.model';
import { TaxPayer } from './taxPayer.model';
import { TaxPayerType } from './taxPayerType.model';
import { User } from './user.model';
import { Wallet } from './wallet.model';

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
  Operation,
  BusStop,
  WalletLiquidation,
  Wallet,
};
