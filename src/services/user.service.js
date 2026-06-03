import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import jwtConfig from "../config/jwt.js";

class UserService {
  async register({ name, email, password, role }) {
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
      role: role ?? "user",
    });

    return user;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return { token, user };
  }

  async delete(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await userRepository.softDelete(id);
  }
}

export default new UserService();