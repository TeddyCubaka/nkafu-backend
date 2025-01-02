import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy'; // Créée à l'étape suivante
import { AuthController } from './auth.controller';
import { Utils } from 'src/utils/utils';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES_IN}s` },
    }),
  ],
  providers: [AuthService, JwtStrategy, Utils,  LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
