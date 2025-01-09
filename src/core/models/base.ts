import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { prisma } from 'prisma/lib/prisma';
import { InputType } from 'src/types/models';

export type ColumnType = {
  proprety: string;
  verbose: string;
};

export abstract class BaseModel<T extends keyof PrismaClient> {
  protected prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    DefaultArgs
  >;
  protected model;

  abstract listColumns: ColumnType[] | '*';
  abstract createForm: InputType[];
  abstract updateForm: InputType[];
  abstract autocompleteData: (data: any[]) => {
    label: string;
    value: string;
  }[];

  defaultFindManyFilter: Record<string, any> = {};
  defaultFindByIdFilter: Record<string, any> = {};

  postFindOne: (data: Record<string, any>) => Promise<Record<string, any>> =
    async (data) => {
      return data;
    };
  preCreateSave: (data: Record<string, any>) => Promise<Record<string, any>> =
    async (data) => {
      return data;
    };

  postCreateSave: (data: Record<string, any>) => Promise<Record<string, any>> =
    async (data) => {
      return data;
    };
  preUpdateSave: (
    id: string,
    data: Record<string, any>,
  ) => Promise<Record<string, any>> = async (id, data) => {
    return data;
  };

  constructor(model: string) {
    this.prisma = prisma;
    this.model = this.prisma[model];
  }

  async find(query?: any) {
    query.select = { ...query.select, ...this.generateInclude() };
    query.where = { ...query['where'], isDeleted: false };
    return this.model.findMany(query);
  }

  async findById(id: number | string, query?: any): Promise<any | null> {
    query.where = { ...query['where'], id: id, isDeleted: false };
    return await this.postFindOne(
      await this.model.findUnique({
        ...query,
        ...this.defaultFindByIdFilter,
      }),
    );
  }

  async create(data: any, query?: any): Promise<any> {
    delete query['where'];
    data = await this.preCreateSave(data);
    if (data.code && data.code > 399) return data;
    const savedData = await this.model.create({
      data,
      ...query,
    });

    return await this.postCreateSave(savedData);
  }

  async updateById(id: string, data: any, query?: any): Promise<any> {
    query.where = { ...query['where'], id: id };
    data = await this.preUpdateSave(id, data);

    return this.model.update({
      ...query,
      data,
    });
  }

  async deleteById(id: number | string, query?: any): Promise<any> {
    query.where = { ...query['where'], id: id };
    return this.model.update({
      ...query,
      data: { isDeleted: true },
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
