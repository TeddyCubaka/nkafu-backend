import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  SignupBodyInterface,
  SignupPayload,
} from './interfaces/signup-payload';
import { prisma } from 'src/lib/prisma';
import { Utils } from 'src/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private utils: Utils,
  ) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: SignupBodyInterface) {
    let verifyUser = await prisma.user.findFirst({
      where: { mobile: user.mobile },
    });

    if (verifyUser !== null)
      return {
        code: 400,
        message: 'ce numero de telephone est deja utilisé',
      };

    verifyUser = await prisma.user.findFirst({
      where: { mobile: user.mobile },
    });

    if (verifyUser !== null)
      return {
        code: 400,
        message: "ce nom d'utilisateur est deja prise",
      };

    const hashedPassword = await this.utils.hashPassword(user.password);

    const savedUser = await prisma.user
      .create({
        data: {
          isActive: true,
          mobile: user.mobile,
          name: user.name,
          password: hashedPassword,
          roleId: null,
        },
      })
      .then((data) => ({
        code: 201,
        message: 'compte créé avec succès',
        data: data,
      }))
      .catch((error) => ({
        code: 400,
        message: "une erreur s'est produite",
        error: error.message,
      }));

    return savedUser;
  }
}
