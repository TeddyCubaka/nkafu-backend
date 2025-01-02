import { PrismaClient } from '@prisma/client';
import { prisma } from 'src/lib/prisma';
import { InputType } from 'src/types/models';

export type columnType = {
  key: string;
  verbose: string;
};

export abstract class BaseModel<T extends keyof PrismaClient> {
  protected prisma;
  protected model;

  abstract listColumns: columnType[] | '*';
  abstract createForm: InputType[];
  abstract updateForm: InputType[];
  abstract autocompleteData: (data: any[]) => {
    verbose: string;
    value: string;
  }[];

  constructor(model: string) {
    this.prisma = prisma;
    this.model = this.prisma[model];
  }

  async find(query?: any): Promise<any[]> {
    return this.model.findMany(query);
  }

  async findById(id: number | string, query?: any): Promise<any | null> {
    return this.model.findUnique({
      where: { id: id },
      ...query,
    });
  }

  async create(data: any, query?: any): Promise<any> {
    return this.model.create({
      data,
      ...query,
    });
  }

  async updateById(id: number | string, data: any, query?: any): Promise<any> {
    query.where = { ...query['where'], id: id };
    return this.model.update({
      ...query,
      data,
    });
  }

  async deleteById(id: number | string, query?: any): Promise<any> {
    return this.model.delete({
      where: { id: id },
      ...query,
    });
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
