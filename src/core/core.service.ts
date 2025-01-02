import { Injectable } from '@nestjs/common';
import { prisma } from 'src/lib/prisma';

@Injectable()
export class CoreService {
  async list(modelName: string, params: any) {
    const _model = prisma[modelName];
    if (!_model)
      return {
        code: 404,
        message: 'ressource non trouvé dans le système',
      };

    const data = await _model.findMany();
    return {
      code: 200,
      message: `${data.length} lignes trouvées`,
      data,
    };
  }
}
