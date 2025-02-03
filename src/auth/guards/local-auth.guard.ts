import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identifier', // Le champ utilisé pour l'identifiant
      passwordField: 'password',   // Le champ utilisé pour le mot de passe
    });
  }

  async validate(identifier: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(identifier, password, {}); // Pas besoin de device ici
    if (!user) {
      throw new UnauthorizedException('Identifiant ou mot de passe incorrect');
    }
    return user;
  }
}