import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/user.middleware.js";
 
const router = Router();
 
router.post("/register", userController.register);
router.post("/login", userController.login);
router.delete("/users/:id", authMiddleware, userController.delete);
 
export default router;
 