import { Request, Response } from "express";
import userService from "../services/user.service.js";

class UserController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.register(req.body);

      return res.status(201).json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao registrar";
      return res.status(400).json({
        message,
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const result = await userService.login(email, password);

      return res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao fazer login";
      return res.status(401).json({
        message,
      });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.getById(req.params.id);

      return res.json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao buscar usuário";
      return res.status(404).json({
        message,
      });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const updatedUser = await userService.update(req.params.id, req.body);

      return res.json(updatedUser);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar usuário";
      return res.status(400).json({
        message,
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      await userService.delete(req.params.id);

      return res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao deletar";
      return res.status(404).json({
        message,
      });
    }
  }
}

export default new UserController();
