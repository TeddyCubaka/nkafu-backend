import {
  Body,
  Controller,
  Get,
  Post,
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private utils: Utils,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: LoginInterface, @Req() req: Request) {
    // return await this.utils.getDeviceInfo(req);
    return await this.authService.login(body);
  }

  @Post('signup')
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
}
