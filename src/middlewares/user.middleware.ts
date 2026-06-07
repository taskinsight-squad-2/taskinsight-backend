import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export default (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Token ausente" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Token inválido" });
  }
};
