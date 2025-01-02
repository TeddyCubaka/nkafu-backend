import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'identifier', passwordField: 'password' });
  }

  async validate(identifier: string, password: string) {
    const user = await this.authService.validateUser(identifier, password);
    if (!user) {
    //   throw new Error('Invalid credentials');
      return {
        code : 400,
        message : 'mot de passe incorrect'
      }
    }
    return user;
  }
}
