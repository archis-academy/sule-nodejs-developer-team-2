import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '../config/db';

export default function authorizeRole(roles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    const isTeamMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: { userId: req.user.userId, teamId: req.params.id },
      },
    });
    if (!isTeamMember) {
      res.status(403).json({ message: 'You are not a member of this team' });
      return;
    }
    next();
  };
}
