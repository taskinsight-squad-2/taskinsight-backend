import authService from "../services/authservice.js";

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(
        email,
        password
      );

      return res.json(result);
    } catch (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
  }
}

export default new AuthController();