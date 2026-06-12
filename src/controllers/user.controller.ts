import { Request, Response } from 'express';
import userService from '../services/user.service.js';

class UserController {
  async register(req: Request, res: Response) {
    try {
      const user = await userService.register(req.body);
      return res.status(201).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno';
      return res.status(400).json({ message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      return res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno';
      return res.status(401).json({ message });
    }
  }
}

export default new UserController();
