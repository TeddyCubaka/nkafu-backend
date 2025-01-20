import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserDevice } from 'src/types/userDevice.auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'identifier', passwordField: 'password' });
  }

  async validate(identifier: string, password: string, userDevice: UserDevice) {
    const user = await this.authService.validateUser(
      identifier,
      password,
      userDevice,
    );
    if (!user) {
      //   throw new Error('Invalid credentials');
      return {
        code: 400,
        message: 'mot de passe incorrect',
      };
    }
    return user;
  }
}
