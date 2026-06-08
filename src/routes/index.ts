import { Router } from "express";
import userRoutes from "./user.routes.js";
import taskRoutes from "./task.routes.js";

const router = Router();

// Keep both /auth and /users so frontend and existing API clients work.
router.use("/auth", userRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);

export default router;
