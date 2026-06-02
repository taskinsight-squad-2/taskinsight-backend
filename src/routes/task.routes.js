// exemplo: src/routes/task.routes.js
import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", taskController.create);
router.get("/", taskController.list);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.remove);

export default router;