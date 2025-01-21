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

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
