import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import { IUser } from '../models/user.model.js';
import userRepository from '../repositories/user.repository.js';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

const sanitizeUser = (user: IUser): Omit<IUser, 'password'> => {
  const { password, ...rest } = user.toObject();
  return rest as Omit<IUser, 'password'>;
};

class UserService {
  async register({ name, email, password }: RegisterInput) {
    if (!name || !email || !password) {
      throw new Error('Nome, email e senha sao obrigatorios');
    }

    const userExists = await userRepository.findByEmail(email);

    if (userExists) {
      throw new Error('Usuario ja existe');
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return sanitizeUser(user);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error('Email e senha sao obrigatorios');
    }

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Credenciais invalidas');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error('Credenciais invalidas');
    }

    const options: SignOptions = {
      expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'],
    };

    const token = jwt.sign({ id: user._id }, jwtConfig.secret, options);

    return {
      user: sanitizeUser(user),
      token,
    };
  }
}

export default new UserService();
