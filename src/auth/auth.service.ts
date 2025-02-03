import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupBodyInterface } from './interfaces/signup-payload';
import { prisma } from 'prisma/lib/prisma';
import { Utils } from 'src/utils/utils';
import { UserConnectionLog } from 'src/utils/userConnectionLogs';
import { formatPrismaError } from 'src/utils/format-prisma-error';
import { UserDevice } from 'src/types/userDevice.auth';
import { MailUtil } from 'src/utils/mail.util';
import { TokenService } from 'src/utils/token';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    // private readonly jwtService: JwtService,
    private utils: Utils,
    private readonly tokenService: TokenService,
  ) {}

  // async login(reqBody: any, userDevice: UserDevice) {
  //   try {
  //     const user = await this.validateUser(
  //       reqBody.identifier,
  //       reqBody.password,
  //       userDevice,
  //     );

  //     if (user.code >= 400 || 'data' in user == false) return user;
  //     const accessToken = this.tokenService.generateAccessToken(
  //       user.data,
  //       '1h',
  //     );

  //     return { ...user, access_token: accessToken };
  //   } catch (error) {
  //     return {
  //       code: 400,
  //       message: error.message,
  //     };
  //   }
  // }

  async login(reqBody: any, request: Request) {
    try {
      // Récupérez les informations du dispositif depuis l'objet `request`
      const userDevice = request['device'];

      // Validez l'utilisateur avec les informations du dispositif
      const user = await this.validateUser(
        reqBody.identifier,
        reqBody.password,
        userDevice,
      );

      if (user.code >= 400 || !('data' in user)) return user;

      // Générez un token d'accès
      const accessToken = this.tokenService.generateAccessToken(
        user.data,
        '1h',
      );

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

  async validateUser(
    identifier: string,
    password: string,
    userDevice: UserDevice | any,
  ) {
    try {
      let user = await prisma.user.findFirst({
        where: {
          OR: [{ mobile: identifier }, { name: identifier }],
          isActive: true,
          isDeleted: false,
        },
        include: {
          _count: {
            select: {
              userDevices: true,
            },
          },
          userDevices: {
            where: { deviceInnerId: userDevice.deviceInnerId, isActive: true },
          },
          agent: {
            include: {
              wallets: { include: { currency: true } },
              organization: true,
            },
          },
          role: true,
        },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        const today = new Date();
        const currentYear = today.getFullYear().toString();
        const currentMonth = (today.getMonth() + 1).toString();
        const currentDate = today.toLocaleDateString();

        let logs = user.meta['logs']?.login || { login: {} };
        if (!logs[currentYear]) {
          logs[currentYear] = {};
        }
        if (!logs[currentYear][currentMonth]) {
          logs[currentYear][currentMonth] = [];
        }
        if (!logs[currentYear][currentMonth].includes(currentDate)) {
          logs[currentYear][currentMonth].push(currentDate);
        }

        if (
          user.userDevices.length == 0 &&
          user._count.userDevices >= user.allowedDeviceNumber
        ) {
          return {
            code: 400,
            message:
              'vous avez atteint le nombre maximum des connexion des appereil qui vous sont autorisés',
            user,
          };
        } else if (
          user.userDevices.length == 0 &&
          user.allowedDeviceNumber > user._count.userDevices
        ) {
          const accessToken = this.tokenService.generateAccessToken(
            user,
            '20m',
            'otp',
          );
          const existingDevice = await prisma.userDevice.findFirst({
            where: { deviceInnerId: userDevice.deviceInnerId, userId: user.id },
          });

          if (existingDevice !== null) {
            await prisma.userDevice.update({
              where: { id: existingDevice.id },
              data: {
                deviceType: userDevice.deviceType,
                os: userDevice.os,
                browser: userDevice.browser,
                ip: userDevice.ip,
              },
            });
          } else {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                userDevices: {
                  create: {
                    deviceInnerId: userDevice.deviceInnerId,
                    deviceType: userDevice.deviceType,
                    os: userDevice.os,
                    browser: userDevice.browser,
                    ip: userDevice.ip,
                  },
                },
              },
            });
          }
          return {
            code: 200,
            message:
              'Veuillez choisir un moyen par le quel nous allons vous envoyer le code de confirmation',
            redirectToOpt: true,
            otpMethod: [
              { name: 'sms', value: 'sms' },
              { name: 'email', value: 'email' },
            ],
            token: accessToken,
          };
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            meta: { logs: {} },
          },
        });
        const { password, ...result } = user;

        return {
          code: 200,
          message: 'connexion réussie',
          redirectToOpt: false,
          data: result,
        };
      }
      return {
        code: 404,
        message: 'compte introuvable ou mot de passe incorrect',
      };
    } catch (error) {
      console.log(error);
      const formatedError = formatPrismaError(error);
      return {
        code: formatedError.code,
        message: formatedError.message,
        // data : formatedError
      };
    }
  }

  async changeUserPassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    userId: string;
  }) {
    try {
      let user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { password: true },
      });

      if ((await bcrypt.compare(data.currentPassword, user.password)) == false)
        return {
          code: 401,
          message: 'votre mot de passe saisi est incorrect',
        };

      if (data.newPassword !== data.confirmNewPassword) {
        return {
          code: 400,
          message: 'vos mots de passes ne correspondent pas',
        };
      }

      user = await prisma.user.update({
        where: { id: data.userId },
        data: { password: await this.utils.hashPassword(data.newPassword) },
      });

      return {
        code: 200,
        message: 'votre mot de passe a été mis à jour avec succès',
      };
    } catch (error) {
      return formatPrismaError(error) as any;
    }
  }

  async askForPasswordReset(userMail: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { mail: userMail },
        select: { mobile: true, mail: true, id: true },
      });

      if (user == null)
        return {
          code: 404,
          message: 'utilisateur introuvable',
        };

      const token = this.tokenService.generateAccessToken(
        {
          mobile: user.mobile,
          mail: user.mail,
          id: user.id,
        },
        '20m',
        'renew_password',
      );

      const mailUtil = new MailUtil();
      await mailUtil.sendMail(
        user.mail,
        'Changement de mot de passe',
        `Cliquez sur ce lien pour changer votre mot de passe: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/change-password/${token}">Changer mot de passe</a>`,
      );

      return {
        code: 200,
        message:
          'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse email',
      };
    } catch (error) {
      return {
        code: 400,
        message: "Nous n'avons pas pu traiter votre demande",
        error: error.message,
      };
    }
  }
}
