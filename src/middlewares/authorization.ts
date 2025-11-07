import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';

export default function authorizeRole(roles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
}
