import { PrismaClient } from '@prisma/client';
import { prisma } from 'prisma/lib/prisma';
import { MailUtil } from 'src/utils/mail.util';
import { SmsUtil } from 'src/utils/sms.util';

export class OTPManager {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async generateAndSendOTP(
    userId: string,
    method: 'sms' | 'email',
    deviceInnerId: string,
  ) {
    const otp = this.generateOTP();
    const user = await this.db.user.findUnique({ where: { id: userId } });
    let data: { [key: string]: any } | null = null;
    if (method === 'sms') {
      if (!user.mobile || user.mobile == null)
        throw new Error("Cet utilisateur n'a pas de numero de téléphone");
      data = await this.sendSMS(user.mobile, otp);
    } else if (method === 'email') {
      if (!user.mail || user.mail == null)
        throw new Error("Cet n'a pas d'adresse email");
      data = await this.sendEmail(user.mail, otp);
    }
    await this.db.userDevice.updateMany({
      where: { deviceInnerId, userId },
      /*
       * save the token into the user device and set the expiration time to 20 seconds
       */
      data: { otp: +otp, otpExpireAt: new Date(Date.now() + 200000) },
    });
    return data;
  }

  private generateOTP(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp.padStart(6, '0');
  }

  private async sendSMS(phone: string, otp: string) {
    const smsUtil = new SmsUtil();
    return await smsUtil.sendSMS({
      phoneNumber: phone,
      message: `Votre code de vérification est ${otp}`,
    });
  }

  private async sendEmail(email: string, otp: string): Promise<any> {
    const mailUtil = new MailUtil();
    return await mailUtil.sendMail(
      email,
      'Code de vérification',
      `Votre code de vérification est ${otp}`,
    );
  }

  async verifyOTP(
    userId: string,
    otp: string,
    deviceInnerId: string,
  ): Promise<{ code: number; message: string; data?: any }> {
    const userDevice = await this.db.userDevice.findFirst({
      where: {
        userId,
        otp: +otp,
        otpExpireAt: { gte: new Date() },
        deviceInnerId,
      },
    });
    if (userDevice !== null) {
      let user = await prisma.user.update({
        where: {
          id: userId,
          isActive: true,
          isDeleted: false,
        },
        data: {
          userDevices: {
            updateMany: {
              where: { userId, otp: +otp },
              data: { isActive: true },
            },
          },
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
          // u can add here extra data to return on connection
          role: true,
        },
      });

      return {
        code: 200,
        message: 'Code vérifié avec succès',
        data: user,
      };
    }
    return {
      code: 400,
      message: 'Code incorrect ou expiré',
    };
  }
}
