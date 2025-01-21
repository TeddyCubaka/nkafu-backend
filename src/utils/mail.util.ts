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
    await this.transporter.sendMail({
      from: `"No Reply" noreply@ziro-pay.com`,
    //   from: `"No Reply" <${this.transporter.auth.user}>`,
      to,
      subject,
      html,
    });
  }
}
