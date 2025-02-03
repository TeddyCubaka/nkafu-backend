import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CoreService } from './core.service';
import { Multer } from 'multer';
import { Request, Response } from 'express';
import { coreConfig as config } from './models/core.model';
import { QueriesUtils } from 'src/utils/query-to-prisma-params';
import { formatPrismaError } from 'src/utils/format-prisma-error';
import {
  DataFormatter,
  // validateForm
} from 'src/utils/validate-form';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import saveImage from 'src/utils/saveImage';
import { join } from 'path';

@Controller('')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('list/core/:model')
  @UseGuards(JwtAuthGuard)
  async list(
    @Param('model') model: string,
    @Res() res: Response,
    @Query() query: { [key: string]: any },
    @Req() req: Request,
  ) {
    const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

    if (!(modelName in config)) {
      return res.status(404).json({
        code: 404,
        message: 'ressource non trouvé dans le système',
      });
    }
    const queriesUtils = new QueriesUtils();
    const _queries = queriesUtils.toPrismaFilterMap(query);

    const _model = new config[modelName]();
    let data = await _model
      .find(_queries)
      .then((data) => ({
        code: 200,
        message: `${data.length} lignes trouvées`,
        data,
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

    if (data.code == 200) {
      data = {
        ...data,
        meta: {
          listColumns: _model.listColumns,
        },
      };
    }

    return res.status(data.code).json(data);
  }

  @Get('autocomplete/core/:model')
  @UseGuards(JwtAuthGuard)
  async modelAutocomple(@Param('model') model: string, @Res() res: Response) {
    const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

    if (!(modelName in config)) {
      return res.status(404).json({
        code: 404,
        message: 'route non trouvé dans le système',
      });
    }

    const _model = new config[modelName]();
    const data = await _model.find({});
    return res.status(200).json({
      code: 200,
      message: 'données trouvées',
      data: _model.autocompleteData(data),
    });
  }

  @Post('create/core/:model')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('file'))
  async create(
    @Param('model') model: string,
    @Res() res: Response,
    @Req() req: Request,
    @Query() query: { [key: string]: any },
    @Body() body: Record<string, any>,
    @UploadedFiles() files: Array<Multer.File>,
  ) {
    try {
      const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

      if (!(modelName in config)) {
        return res.status(404).json({
          code: 404,
          message: 'ressource non trouvé dans le système',
        });
      }
      let reqData = body;
      if (files.length > 0 && 'json' in body) {
        reqData = JSON.parse(body.json);
        files.forEach((file) => {
          const fileNameParts = file.originalname.split('_');
          const originalFieldName = fileNameParts[0];
          const url = saveImage('upload/test', file);
          reqData[originalFieldName] = url;
        });
      }
      const queriesUtils = new QueriesUtils();
      const _queries = queriesUtils.toPrismaFilterMap(query);
      const _model = new config[modelName]();
      const dataFormatter = new DataFormatter(req.user['userId']);
      const validatedData = dataFormatter.formatData(
        reqData,
        _model.createForm,
      );

      const data = await _model
        .create(
          { ...validatedData, createdByUserId: req.user['userId'] },
          _queries,
        )
        .then((data) => ({
          code: 200,
          message: `la création a réussie`,
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

      return res.status(data.code).json({
        ...data,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        code: 400,
        message: error.message || "une erreur s'est produite",
        data: body,
      });
    }
  }

  @Patch('change/core/:model/:uuid')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('file'))
  async update(
    @Param('model') model: string,
    @Param('uuid') uuid: string,
    @Res() res: Response,
    @Query() query: { [key: string]: any },
    @Body() body: Record<string, any>,
    @Req() req: Request,
    @UploadedFiles() files: Array<Multer.File>,
  ) {
    try {
      const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

      if (!(modelName in config)) {
        return res.status(404).json({
          code: 404,
          message: 'ressource non trouvé dans le système',
        });
      }

      let reqData = body;

      if (files && files.length > 0 && 'json' in body) {
        reqData = JSON.parse(body.json);
        files.forEach((file) => {
          const fileNameParts = file.originalname.split('_');
          const originalFieldName = fileNameParts[0];
          const url = saveImage('upload/test', file);
          reqData[originalFieldName] = url;
        });
      }

      const queriesUtils = new QueriesUtils();
      const _queries = queriesUtils.toPrismaFilterMap(query);
      const _model = new config[modelName]();
      const dataFormatter = new DataFormatter(req.user['userId']);
      const validatedData = dataFormatter.formatData(
        reqData,
        _model.updateForm,
      );

      const data = await _model
        .updateById(
          uuid,
          { ...validatedData, updatedByUserId: req.user['userId'] },
          _queries,
        )
        .then((data) => {
          if (data.code) return data;
          return {
            code: 200,
            message: `mise à jour réussie`,
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

      return res.status(data.code).json({
        ...data,
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: error.message || "une erreur s'est produite",
      });
    }
  }

  @Delete('delete/core/:model/:uuid')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('model') model: string,
    @Param('uuid') uuid: string,
    @Res() res: Response,
    @Query() query: { [key: string]: any },
  ) {
    const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

    if (!(modelName in config)) {
      return res.status(404).json({
        code: 404,
        message: 'ressource non trouvé dans le système',
      });
    }
    const queriesUtils = new QueriesUtils();
    const _queries = queriesUtils.toPrismaFilterMap(query);

    const _model = new config[modelName]();
    const data = await _model
      .deleteById(uuid, _queries)
      .then((data) => {
        if (data.code) return data;
        return {
          code: 200,
          message: 'suppression réussie avec succès',
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
      meta: {
        listColumns: _model.listColumns,
      },
    });
  }

  @Get('list/core/:model/:uuid')
  @UseGuards(JwtAuthGuard)
  async getOne(
    @Param('model') model: string,
    @Param('uuid') uuid: string,
    @Res() res: Response,
    @Query() query: { [key: string]: any },
    @Body() body: Record<string, any>,
  ) {
    const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

    if (!(modelName in config)) {
      return res.status(404).json({
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

    return res.status(data.code).json({
      ...data,
    });
  }

  @Get(':action/core/:model')
  @UseGuards(JwtAuthGuard)
  modelHeads(
    @Param('model') model: string,
    @Param('action') action: string,
    @Res() res: Response,
  ) {
    const modelName = `${model[0].toUpperCase()}${model.slice(1)}`;

    if (!(modelName in config) || !['create', 'change'].includes(action)) {
      return res.status(404).json({
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

  @Get('load/menu')
  @UseGuards(JwtAuthGuard)
  async loadMenu(@Req() request: Request, @Res() res: Response) {
    const data = await this.coreService.loadMenu(request.user['userId']);
    return res.status(data.code).json(data);
  }

  @Get('load/stats')
  @UseGuards(JwtAuthGuard)
  async userStats(@Req() request: Request, @Res() res: Response) {
    const data = await this.coreService.loadStats(request.user['userId']);
    return res.status(data.code).json(data);
  }

  // @Get('image/*')
  // getImage(@Param(0) imagePath: string, @Res() res: Response) {
  //   return res.sendFile(join(__dirname, '..', '../../public', imageName));
  // }

  @Get('image/*imagePath') // Capture tout ce qui vient après /image/
  getImage(@Param('imagePath') imagePath: string[], @Res() res: Response) {
    console.log(imagePath);
    const filePath = join(__dirname, '..', '../../public', imagePath.join('/'));
    return res.sendFile(filePath);
  }
}
