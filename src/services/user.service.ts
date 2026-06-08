import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import jwtConfig from "../config/jwt.js";
import { IUser } from "../models/user.model.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

interface UpdateInput {
  name?: string;
  email?: string;
  password?: string;
  role?: "user" | "admin";
}

type UserResponse = Omit<IUser, "password">;

interface LoginResponse {
  token: string;
  user: UserResponse;
}

const sanitizeUser = (user: IUser): UserResponse => {
  const { password, ...rest } = user.toObject();
  return rest as UserResponse;
};

class UserService {
  async register({ name, email, password, role }: RegisterInput): Promise<UserResponse> {
    const userExists = await userRepository.findByEmail(email);

    if (userExists) {
      throw new Error("Email já cadastrado");
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role ?? "user",
    });

    return sanitizeUser(user);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
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
      jwtConfig.secret as string,
      { expiresIn: jwtConfig.expiresIn } as any
    );

    return { token, user: sanitizeUser(user) };
  }

  async getById(id: string): Promise<UserResponse> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return sanitizeUser(user);
  }

  async update(id: string, data: UpdateInput): Promise<UserResponse> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (data.email) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new Error("Email já está em uso");
      }
    }

    if (data.password) {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    const updatedUser = await userRepository.update(id, data);

    if (!updatedUser) {
      throw new Error("Falha ao atualizar usuário");
    }

    return sanitizeUser(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await userRepository.softDelete(id);
  }
}

export default new UserService();
