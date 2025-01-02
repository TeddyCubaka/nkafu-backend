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

  async find(): Promise<any[]> {
    return this.model.findMany();
  }

  async findById(id: number | string): Promise<any | null> {
    return this.model.findUnique({
      where: { id: Number(id) },
    });
  }

  async create(data: any): Promise<any> {
    return this.model.create({
      data,
    });
  }

  async updateById(id: number | string, data: any): Promise<any> {
    return this.model.update({
      where: { id: Number(id) },
      data,
    });
  }

  async deleteById(id: number | string): Promise<any> {
    return this.model.delete({
      where: { id: Number(id) },
    });
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
