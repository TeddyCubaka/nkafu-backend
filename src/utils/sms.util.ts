export class SmsUtil {
  private headers: HeadersInit;
  private smsConfig: {
    smsSenderId: string | undefined;
    postUrl: string | undefined;
  };

  constructor() {
    this.smsConfig = {
      smsSenderId: process.env.SMS_SENDER_ID,
      postUrl: process.env.SMS_POST_URL,
    };
    this.headers = {
      Authorization: `Bearer ${process.env.SMS_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  async sendSMS({
    phoneNumber,
    message,
  }: {
    phoneNumber: string;
    message: string;
  }): Promise<any> {
    try {
      phoneNumber = `243${phoneNumber.slice(-9)}`;
      const response = await fetch(this.smsConfig.postUrl!, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          dest_type: 'singleton',
          pending_type: 0,
          message: message,
          singleton: phoneNumber,
          senderid: this.smsConfig.smsSenderId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        // throw new Error('Network response was not ok');
        return {
          code: 500,
          message: "Une erreur est survenue lors de l'envoi du SMS",
          error: {
            message: data.message,
          },
        };
      }
      return await {
        code: 200,
        message: 'SMS envoyé avec succès',
        data: data,
      };
    } catch (err) {
      console.error(err);
      // return Promise.reject(err);
      return {
        code: 500,
        message: "Une erreur est survenue lors de l'envoi du SMS",
        error: {
          message: err.message,
        },
      };
    }
  }
}
