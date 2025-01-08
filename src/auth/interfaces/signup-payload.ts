export const SignupPayload = {
  name: 'string',
  mobile: 'string',
  password: 'string',
  allowedDeviceNumber: ['number', 'null'],
};

export interface SignupBodyInterface {
  name: string;
  mobile: string;
  password: string;
  allowedDeviceNumber: number | null;
  mustRenewPassword?: boolean;
  mail?: string;
}
