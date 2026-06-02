import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, taskController.create);
router.get("/", authMiddleware, taskController.list);
router.put("/:id", authMiddleware, taskController.update);
router.delete("/:id", authMiddleware, taskController.remove);

export default router;