import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from '../types/express';
import jwtService from '../utils/jwt';
import { AppError } from '../utils/appError';

export default function authentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    const decodedToken = jwtService.verifyToken(
      header.split(' ')[1],
      process.env.JWT_ACCESS as string
    );
    req.user = decodedToken as JwtPayload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
