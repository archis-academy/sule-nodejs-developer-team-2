import { Router } from 'express';
import authentication from '../middlewares/authentication';
import authorizeRole from '../middlewares/authorization';
import authorizeMember from '../middlewares/authorizeMember';
import { validateBody, validateId } from '../middlewares/validation';
import { createTeamSchema } from '../dto/team/create.team';
import { createTeamMemberSchema } from '../dto/team/create.team-member';
import { updateTeamSchema } from '../dto/team/update.team';
import teamController from '../controllers/team';
import { Role } from '@prisma/client';

const teamRouter = Router();

teamRouter.use(authentication('access'));

teamRouter.post(
  '/',
  authorizeRole([Role.ADMIN]),
  validateBody(createTeamSchema),
  teamController.createTeam
);
teamRouter.get('/', teamController.getTeams);
teamRouter.get('/:id', validateId('id'), teamController.getTeamById);
teamRouter.put(
  '/:id',
  authorizeRole([Role.ADMIN]),
  validateId('id'),
  validateBody(updateTeamSchema),
  teamController.updateTeam
);
teamRouter.delete(
  '/:id',
  authorizeRole([Role.ADMIN]),
  validateId('id'),
  teamController.deleteTeam
);
teamRouter.post(
  '/:id/members',
  authorizeRole([Role.ADMIN]),
  validateId('id'),
  validateBody(createTeamMemberSchema),
  teamController.addMember
);
teamRouter.get(
  '/:id/members',
  validateId('id'),
  authorizeMember('id'),
  teamController.getTeamMembers
);
teamRouter.delete(
  '/:id/members/:userId',
  authorizeRole([Role.ADMIN]),
  validateId('id', 'userId'),
  teamController.removeMember
);

export default teamRouter;
