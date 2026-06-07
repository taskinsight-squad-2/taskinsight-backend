import { Router } from "express";
import userRoutes from "./user.routes.js";
import taskRoutes from "./task.routes.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/tasks", taskRoutes);

export default router;
