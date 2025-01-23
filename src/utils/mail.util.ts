import * as nodemailer from 'nodemailer';

export class MailUtil {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const data = await this.transporter.sendMail({
        from: `"No Reply" noreply@ziro-pay.com`,
        //   from: `"No Reply" <${this.transporter.auth.user}>`,
        to,
        subject,
        html,
      });

      return {
        code: 200,
        message: 'Mail envoyé avec succès',
        data: data,
      };
    } catch (error) {
      return {
        code: 400,
        message: 'envoi de mail échoué',
        error: {
          message: error.message,
        },
      };
    }
  }
}
