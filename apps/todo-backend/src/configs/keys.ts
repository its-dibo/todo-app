import { registerAs } from '@nestjs/config';

export default registerAs('keys', () => ({
  PublicKey: process.env.PublicKey,
  privateKey: process.env.privateKey,
}));
