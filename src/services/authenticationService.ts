import { sign } from 'jsonwebtoken';

export const generateAccessToken = (username: string, secret: string) => {
  return sign({ username }, secret, { expiresIn: '30s' });
};