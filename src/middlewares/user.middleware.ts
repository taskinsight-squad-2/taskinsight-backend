import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import jwtConfig from '../config/jwt.js';

interface JwtPayload {
  id?: string;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token ausente' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;

    if (!decoded.id || !Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ message: 'Token invalido' });
    }

    req.userId = decoded.id;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token invalido' });
  }
};
