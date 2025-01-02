import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupBodyInterface } from './interfaces/signup-payload';
import { prisma } from 'src/lib/prisma';
import { Utils } from 'src/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private utils: Utils,
  ) {}

  async login(reqBody: any) {
    try {
      const user = await this.validateUser(
        reqBody.identifier,
        reqBody.password,
      );

      if (user.code >= 400 || 'data' in user == false) return user;
      const payload = { mobile: user.data.mobile, sub: user.data.id };

      const accessToken = this.jwtService.sign(payload);

      return { ...user, access_token: accessToken };
    } catch (error) {
      return {
        code: 400,
        message: error.message,
      };
    }
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

  async validateUser(identifier: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ mobile: identifier }, { name: identifier }],
      },
      include: { userDevices: true },
    });

    if (user && (await await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return {
        code: 200,
        message: 'connexion réussie',
        data: result,
      };
    }
    return {
      code: 404,
      message: 'compte introuvable ou mot de passe incorrect',
    };
  }

  async manageUserDevices(user: {
    id: string;
    allowedDeviceNumber: Number;
    userDevices: {
      id: string;
      createdAt: Date;
      userId: string;
      deviceType: string;
      os: string;
      browser: string;
      ip: string;
    }[];
  }, userDevice){

  };
}
