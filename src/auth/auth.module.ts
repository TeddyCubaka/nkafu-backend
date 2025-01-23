import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy'; // Créée à l'étape suivante
import { AuthController } from './auth.controller';
import { Utils } from 'src/utils/utils';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenService } from 'src/utils/token';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'nwiojfnonfoiwnfoiwjfoijf4iu9802u844u982u8u982u8ru9824ur8924u9842u9824ur8924ur9284ur9824ur89u2u4r8924ur98u24r89u498u2489ur8924r894ur894uru9r',
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN || 3600}s` },
    }),
  ],
  providers: [AuthService, JwtStrategy, Utils, LocalStrategy, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
