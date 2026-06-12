import { Secret } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'taskinsight-secret';

export default {
  secret: secret as Secret,
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};
