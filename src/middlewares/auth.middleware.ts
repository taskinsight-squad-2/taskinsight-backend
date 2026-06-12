import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const authMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const userId = req.header('x-user-id');

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ error: 'Missing or invalid x-user-id header' });
  }

  req.user = { id: userId };
  next();
};
