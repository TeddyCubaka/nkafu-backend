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
import { type } from 'os';

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
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const data = await this.authService.login(body);
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
}
