import { PrismaClient } from '@prisma/client';
import { prisma } from 'prisma/lib/prisma';
import { MailUtil } from 'src/utils/mail.util';
import { SmsUtil } from 'src/utils/sms.util';

export class OTPManager {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async generateAndSendOTP(userId: string, method: 'sms' | 'email') {
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

  async verifyOTP(userId: string, otp: string) {
    //   : Promise<boolean>
    // return storedOTP === otp;
  }
}

// Exemple d'utilisation:
// const db = new Database();
// const cache = await import('cache-manager').then(cacheManager => cacheManager.caching({ store: 'memory', ttl: 300 }));
// const otpManager = new OTPManager(db, cache);
// otpManager.generateAndSendOTP('userId', 'SMS');
