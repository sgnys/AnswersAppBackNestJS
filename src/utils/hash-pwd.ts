import * as crypto from 'crypto';

export const hashPwd = (pwd: string): string => {
  const hmac = crypto.createHmac('sha512', process.env.PWD_SALT);
  hmac.update(pwd);
  return hmac.digest('hex');
};
