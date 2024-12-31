import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignupBodyInterface,
  SignupPayload,
} from './interfaces/signup-payload';
import { Utils } from 'src/utils/utils';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private utils: Utils,
  ) {}

  @Post('login')
  async login(@Request() req) {
    const user = { userId: 1, username: 'test' };
    return this.authService.login(user);
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
