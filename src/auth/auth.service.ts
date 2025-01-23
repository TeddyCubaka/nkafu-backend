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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private utils: Utils,
  ) {}

  async login(reqBody: any, userDevice: UserDevice) {
    try {
      const user = await this.validateUser(
        reqBody.identifier,
        reqBody.password,
        userDevice,
      );

      if (user.code >= 400 || 'data' in user == false) return user;
      const payload = {
        mobile: user.data.mobile,
        sub: user.data.id,
        mail: user.data.mail,
        roleId: user.data.roleId,
      };

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

  async validateUser(
    identifier: string,
    password: string,
    userDevice: UserDevice,
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
            where: { deviceInnerId: userDevice.deviceInnerId },
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
          return {
            code: 200,
            message:
              'Veuillez choisir un moyen par le quel nous allons vous envoyer le code de confirmation',
            redirectToOpt: true,
          };
          // await prisma.user.update({
          //   where: { id: user.id },
          //   data: {
          //     userDevices: {
          //       create: {
          //         deviceInnerId: userDevice.deviceInnerId,
          //         deviceType: userDevice.deviceType,
          //         os: userDevice.os,
          //         browser: userDevice.browser,
          //         ip: userDevice.ip,
          //       },
          //     },
          //   },
          // });
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
}
