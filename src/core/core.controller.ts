import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CoreService } from './core.service';
import { Response } from 'express';
import * as config from './models/core.model';
import { QueriesUtils } from 'src/utils/query-to-prisma-params';
import { formatPrismaError } from 'src/utils/format-prisma-error';
import { validateForm } from 'src/utils/validate-form';

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
        _queries,
      }))
      .catch((error: any) => {
        const formatedError = formatPrismaError(error);
        return {
          code: 400,
          message: "une erreur s'est produite",
          error: {
            details: formatedError.details,
            meta: formatedError.meta,
          },
        };
      });

    return res.status(200).json({
      ...data,
      meta: {
        listColumns: _model.listColumns,
      },
    });
  }

  @Get('autocomplete/core/:model')
  async modelAutocomple(@Param('model') model: string, @Res() res: Response) {
    const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

    if (!(modelName in config)) {
      return res.status(200).json({
        code: 404,
        message: 'route non trouvé dans le système',
      });
    }

    const _model = new config[modelName]();
    const data = await _model.find({});
    return res.status(200).json({
      code: 200,
      message: 'formullaire trouvé',
      data: _model.autocompleteData(data),
    });
  }

  @Post('create/core/:model')
  async create(
    @Param('model') model: string,
    @Res() res: Response,
    @Query() query: { [key: string]: any },
    @Body() body: Record<string, any>,
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
    const validationStatus = validateForm(_model.createForm, body);
    if (validationStatus !== true) {
      return res.status(200).json({
        code: 400,
        message: 'la validation a echoue',
        validationStatus,
      });
    }

    const data = await _model
      .create(body, _queries)
      .then((data) => ({
        code: 200,
        message: `la création a réussie`,
        data,
        _queries,
      }))
      .catch((error: any) => {
        const formatedError = formatPrismaError(error);
        return {
          code: 400,
          message: formatedError.message,
          error: {
            details: formatedError.details,
            meta: formatedError.meta,
          },
        };
      });

    return res.status(200).json({
      ...data,
      meta: {
        listColumns: _model.listColumns,
      },
    });
  }

  @Patch('update/core/:model/:uuid')
  async update(
    @Param('model') model: string,
    @Param('uuid') uuid: string,
    @Res() res: Response,
    @Query() query: { [key: string]: any },
    @Body() body: Record<string, any>,
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
    const validationStatus = validateForm(_model.createForm, body);
    if (validationStatus !== true) {
      return res.status(200).json({
        code: 400,
        message: 'la validation a echoue',
        validationStatus,
      });
    }

    const data = await _model
      .updateById(uuid, body, _queries)
      .then((data) => ({
        code: 200,
        message: `mise à jour réussie`,
        data,
      }))
      .catch((error: any) => {
        const formatedError = formatPrismaError(error);
        return {
          code: 400,
          message: formatedError.message,
          error: {
            details: formatedError.details,
            meta: formatedError.meta,
          },
        };
      });

    return res.status(200).json({
      ...data,
      meta: {
        listColumns: _model.listColumns,
      },
    });
  }

  @Delete('delete/core/:model/:uuid')
  async delete(
    @Param('model') model: string,
    @Param('uuid') uuid: string,
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
      .deleteById(uuid, _queries)
      .then((data) => ({
        code: 200,
        message: 'suppression réussie avec succès',
        data,
        _queries,
      }))
      .catch((error: any) => {
        const formatedError = formatPrismaError(error);
        return {
          code: 400,
          message: formatedError.message,
          error: {
            details: formatedError.details,
            meta: formatedError.meta,
          },
        };
      });

    return res.status(200).json({
      ...data,
      meta: {
        listColumns: _model.listColumns,
      },
    });
  }

  @Get('list/core/:model/:uuid')
  async getOne(
    @Param('model') model: string,
    @Param('uuid') uuid: string,
    @Res() res: Response,
    @Query() query: { [key: string]: any },
    @Body() body: Record<string, any>,
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
      .findById(uuid, _queries)
      .then((data) => {
        if (data == null)
          return {
            code: 404,
            message: `aucun enreigistrement trouvé`,
          };
        return {
          code: 200,
          message: `object trouvé`,
          data,
        };
      })
      .catch((error: any) => {
        const formatedError = formatPrismaError(error);
        return {
          code: 400,
          message: formatedError.message,
          error: {
            details: formatedError.details,
            meta: formatedError.meta,
          },
        };
      });

    return res.status(200).json({
      ...data,
    });
  }

  @Get(':action/core/:model')
  modelHeads(
    @Param('model') model: string,
    @Param('action') action: string,
    @Res() res: Response,
  ) {
    const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

    if (!(modelName in config) || !['create', 'update'].includes(action)) {
      return res.status(200).json({
        code: 404,
        message: 'route non trouvé dans le système',
      });
    }

    const _model = new config[modelName]();
    return res.status(200).json({
      code: 200,
      message: 'formullaire trouvé',
      data: action == 'create' ? _model.createForm : _model.updateForm,
    });
  }
}
