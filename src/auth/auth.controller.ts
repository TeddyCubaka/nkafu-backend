import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
import { OTPManager } from './utils/otpManager';
const useragent = require('useragent');

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private utils: Utils,
  ) {}

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

  @Get('auth/password_reset')
  askForPasswordRestHead(@Req() req: Request, @Res() res: Response) {
    return res.json({
      code: 200,
      message: 'veuillez remplir ces informations',
      data: [
        {
          proprety: 'mail',
          verbose: 'adresse mail',
          type: 'text',
        },
      ],
    });
  }

  @Post('auth/password_reset')
  async askForPasswordRest(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { mail: string },
  ) {
    if ('mail' in body == false)
      return res.status(400).json({
        code: 400,
        message: 'veuillez remplir toute les informations demandés',
      });
    const response = await this.authService.askForPasswordReset(body.mail);
    return res.status(response.code).json(response);
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

  @Get('auth/otp')
  @UseGuards(JwtAuthGuard)
  async sendOtpToUser(
    @Req() request: Request,
    @Query('method') method: 'sms' | 'email',
    @Res() res: Response,
  ) {
    if (method !== 'sms' && method !== 'email')
      return res
        .status(400)
        .json({ code: 400, message: 'methode non supportée' });

    if (request.user['type'] !== 'otp')
      return res.status(200).json({
        code: 400,
        message: "Le token fourni n'est pas fait pour cette operation",
      });
    const userId = request.user['userId'];
    const otpManager = new OTPManager();

    try {
      const agent = useragent.parse(request.headers['user-agent']);

      const deviceInnerId = this.generateDeviceInnerId(agent);

      const otpStatus = await otpManager.generateAndSendOTP(
        userId,
        method,
        deviceInnerId,
      );
      return res.status(otpStatus.code).json(otpStatus);
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: "une erreur s'est passée lors de l'envoie de l'otp",
        error: {
          message: error.message,
        },
      });
    }
  }

  @Post('auth/otp/validation')
  @UseGuards(JwtAuthGuard)
  async validateOtpCode(
    @Req() request: Request,
    @Body() body: { otp: string },
    @Res() res: Response,
  ) {
    const userId = request.user['userId'];
    const otpManager = new OTPManager();

    try {
      const agent = useragent.parse(request.headers['user-agent']);
      const deviceInnerId = this.generateDeviceInnerId(agent);
      const otpStatus = await otpManager.verifyOTP(
        userId,
        body.otp,
        deviceInnerId,
      );
      return res.status(otpStatus.code).json(otpStatus);
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: "une erreur s'est passée lors de l'envoie de l'otp",
        error: {
          message: error.message,
        },
      });
    }
  }
}
