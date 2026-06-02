import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";
import jwtConfig from "../config/jwt.js";

class AuthService {
  async register({ name, email, password }) {
    const userExists = await userRepository.findByEmail(email);

    if (userExists) {
      throw new Error("Usuário já existe");
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      { id: user._id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return {
      token,
      user,
    };
  }
}

export default new AuthService();