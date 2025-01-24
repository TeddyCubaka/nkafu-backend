import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Génère un token d'accès pour un utilisateur
   * @param user - Les informations de l'utilisateur à inclure dans le token
   * @param expiresIn - La durée de vie du token (par défaut 1 heure)
   * @param type - Le type de token à générer (par défaut "access")
   * @returns Un token JWT signé
   */
  generateAccessToken(
    user: {
      mobile: string;
      mail: string;
      id: string;
    },
    expiresIn: string = '1h',
    type: 'access' | 'refresh' | 'otp' | 'renew_password' = 'access',
  ): string {
    const payload = {
      mobile: user.mobile,
      sub: user.id,
      mail: user.mail,
      userId: user.id,
      type: type,
    };
    return this.jwtService.sign(payload, { expiresIn });
  }

  /**
   * Vérifie la validité d'un token et retourne son payload
   * @param token - Le token à vérifier
   * @returns Le payload du token si valide
   * @throws Error si le token est invalide ou expiré
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  /**
   * Décode un token sans vérifier sa validité
   * @param token - Le token à décoder
   * @returns Le payload du token, sans vérification de validité ou d'expiration
   */
  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  /**
   * Rafraîchit un token existant en générant un nouveau avec une nouvelle expiration
   * @param token - Le token existant à rafraîchir
   * @param expiresIn - La nouvelle durée de vie du token (par défaut 1 heure)
   * @returns Un nouveau token JWT signé
   * @throws Error si le token original est invalide ou expiré
   */
  async refreshToken(token: string, expiresIn: string = '1h'): Promise<string> {
    const payload = await this.verifyToken(token);
    return this.generateAccessToken(payload, expiresIn);
  }
}
