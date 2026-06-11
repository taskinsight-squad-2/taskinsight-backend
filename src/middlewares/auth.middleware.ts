import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import jwtConfig from '../config/jwt.js';

interface JwtPayload {
  id?: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;

    if (!decoded.id || !Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = { id: decoded.id };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
