import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { CoreService } from './core.service';
import { Response } from 'express';
import * as config from './models/core.model';
import { QueriesUtils } from 'src/utils/query-to-prisma-params';
import { formatPrismaError } from 'src/utils/format-prisma-error';

@Controller('')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('list/core/:model')
  async list(
    @Param('model') model: string,
    @Res() res: Response,
    @Query() query: { [key: string]: any },
  ) {
    const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

    if (!(modelName in config)) {
      return res.status(200).json({
        code: 404,
        message: 'ressource non trouvé dans le système',
      });
    }
    const queriesUtils = new QueriesUtils();
    const _queries = queriesUtils.toPrismaFilterMap(query);

    const _model = new config[modelName]();
    const data = await _model
      .find(_queries)
      .then((data) => ({
        code: 200,
        message: `${data.length} lignes trouvées`,
        data,
      }))
      .catch((error: any) => ({
        code: 400,
        message: "une erreur s'est produite",
        error: formatPrismaError(error),
      }));

    return res.status(200).json({
      ...data,
      meta: {
        listColumns: _model.listColumns,
      },
    });
  }
}
