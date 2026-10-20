import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConstants = {
  get secret(): string {
    const secretFromEnv = process.env.JWT_TOKEN;
    if (!secretFromEnv) {
      throw new Error('JWT secret is not defined in environment variables.');
    }
    return secretFromEnv;
  },
};
