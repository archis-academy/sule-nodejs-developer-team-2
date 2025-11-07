import { NextFunction, Request, Response } from 'express';
import prisma from '../config/db';

export default function authorizeMember(teamIdParamKey: string = 'id') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const teamId = req.params[teamIdParamKey];
    if (!teamId) {
      res
        .status(400)
        .json({ message: `Team ID parameter '${teamIdParamKey}' is missing` });
      return;
    }
    const isTeamMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: { userId: req.user.userId, teamId },
      },
    });
    if (!isTeamMember) {
      res.status(403).json({ message: 'You are not a member of this team' });
      return;
    }
    next();
  };
}
