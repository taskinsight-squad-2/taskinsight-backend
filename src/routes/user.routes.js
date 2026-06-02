import { Router } from "express";
import rateLimit from "express-rate-limit";
import userController from "../controllers/user.controller.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later" },
});

router.post("/register", authLimiter, userController.register);
router.post("/login", authLimiter, userController.login);

export default router;