import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.JWT_SECRET ||
        'nwiojfnonfoiwnfoiwjfoijf4iu9802u844u982u8u982u8ru9824ur8924u9842u9824ur8924ur9284ur9824ur89u2u4r8924ur98u24r89u498u2489ur8924r894ur894uru9r',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, payload };
  }
}
