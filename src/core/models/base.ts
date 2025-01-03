import { PrismaClient } from '@prisma/client';
import { prisma } from 'src/lib/prisma';
import { InputType } from 'src/types/models';

export type ColumnType = {
  proprety: string;
  verbose: string;
};

export abstract class BaseModel<T extends keyof PrismaClient> {
  protected prisma;
  protected model;

  abstract listColumns: ColumnType[] | '*';
  abstract createForm: InputType[];
  abstract updateForm: InputType[];
  abstract autocompleteData: (data: any[]) => {
    verbose: string;
    value: string;
  }[];
  preCreateSave: (data: Record<string, any>) => Record<string, any> = (data) =>
    data;
  preUpdateSave: (data: Record<string, any>) => Record<string, any> = (data) =>
    data;

  constructor(model: string) {
    this.prisma = prisma;
    this.model = this.prisma[model];
  }

  async find(query?: any) {
    query.select = { ...query.select, ...this.generateInclude() };
    // return this.generateInclude();
    return this.model.findMany(query);
  }

  async findById(id: number | string, query?: any): Promise<any | null> {
    query.where = { ...query['where'], id: id };
    return this.model.findUnique({
      ...query,
    });
  }

  async create(data: any, query?: any): Promise<any> {
    data = this.preCreateSave(data);
    return this.model.create({
      data,
      ...query,
    });
  }

  async updateById(id: number | string, data: any, query?: any): Promise<any> {
    query.where = { ...query['where'], id: id };
    data = this.preUpdateSave(data);
    return this.model.update({
      ...query,
      data,
    });
  }

  async deleteById(id: number | string, query?: any): Promise<any> {
    query.where = { ...query['where'], id: id };
    return this.model.delete({
      ...query,
    });
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  generateInclude(): Record<string, any> {
    const include: Record<string, any> = { id: true };
    if (this.listColumns == '*') return {};
    this.listColumns.forEach((column) => {
      const keys = column.proprety.split('.');
      let currentLevel = include;

      keys.forEach((key, index) => {
        if (!currentLevel[key]) {
          currentLevel[key] = index === keys.length - 1 ? true : { select: {} };
        }
        if (index < keys.length - 1) {
          currentLevel = currentLevel[key].select;
        }
      });
    });

    return include;
  }
}
