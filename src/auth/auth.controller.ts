import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignupBodyInterface,
  SignupPayload,
} from './interfaces/signup-payload';
import { Utils } from 'src/utils/utils';

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
  async signup(@Body() body: SignupBodyInterface) {
    const validator = this.utils.validateRequestBody(body, SignupPayload);
    return validator;
  }
}
