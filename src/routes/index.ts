import { Router } from 'express';
import taskRoutes from './task.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ msg: 'API is running' });
});

router.use('/tasks', taskRoutes);

export default router;
