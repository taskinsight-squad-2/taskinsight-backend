import { Router } from "express";
import taskController from "../controllers/task.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";

const router = Router();

router.use(userMiddleware);

router.post("/", taskController.create);
router.get("/", taskController.getAll);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.delete);

export default router;