import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignupBodyInterface,
  SignupPayload,
} from './interfaces/signup-payload';
import { Utils } from 'src/utils/utils';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDevice } from 'src/types/userDevice.auth';
const useragent = require('useragent');

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private utils: Utils,
  ) {}

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() body: LoginInterface,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const agent = useragent.parse(request.headers['user-agent']);

    const deviceData: UserDevice = {
      deviceInnerId: this.generateDeviceInnerId(agent),
      deviceType: agent.device.family || 'unknown',
      os: `${agent.os.family} ${agent.os.major}`,
      browser: `${agent.family} ${agent.major}`,
      ip: request.ip || String(request.headers['x-forwarded-for']) || '0.0.0.0',
    };

    const data = await this.authService.login(body, deviceData);
    return res.status(data.code).json(data);
  }

  @Post('auth/signup')
  async signup(@Body() body: SignupBodyInterface, @Res() res: Response) {
    const validator = this.utils.validateRequestBody(body, SignupPayload);
    if (validator.isFailed)
      res.status(400).json({
        code: 400,
        message: "une erreur 'est produite",
        error: validator,
      });

    const response = await this.authService.signup(body);
    return res.status(response.code).json(response);
  }

  @Get('auth/verify-token')
  @UseGuards(JwtAuthGuard)
  verifyToken() {
    return { code: 200, message: 'Token is valid' };
  }

  @Get('change/auth/password')
  @UseGuards(JwtAuthGuard)
  changePasswordHead() {
    return {
      code: 200,
      message: 'veuillez remplir ces informations',
      data: [
        {
          proprety: 'currentPassword',
          verbose: 'actuel mot de passe',
          type: 'text',
        },
        {
          proprety: 'newPassword',
          verbose: 'nouveau mot de passe',
          type: 'text',
        },
        {
          proprety: 'confirmNewPassword',
          verbose: 'confirmation du nouveau mot de passe',
          type: 'text',
        },
      ],
    };
  }

  @Patch('change/auth/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body()
    body: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (
      'currentPassword' in body == false ||
      'newPassword' in body == false ||
      'confirmNewPassword' in body == false
    )
      return res.status(400).json({
        code: 400,
        message: 'veuillez remplir toute les informations demandés',
      });
    const response = await this.authService.changeUserPassword({
      ...body,
      userId: req.user['userId'],
    });

    return res.status(response.code).json(response);
  }

  private generateDeviceInnerId(agent: any): string {
    const identifier =
      `${agent.family}-${agent.major}-${agent.os.family}-${agent.os.major}-${agent.device.family}`
        .toLowerCase()
        .replace(/\s/g, '');
    return this.hashDeviceSTring(identifier);
  }

  private hashDeviceSTring(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  }
}
