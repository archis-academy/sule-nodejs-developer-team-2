import { Router } from 'express';
import authentication from '../middlewares/authentication';
import authorizeRole from '../middlewares/authorization';
import { validate, validateId } from '../middlewares/validation';
import { createTeamSchema } from '../dto/team/create.team';
import { updateTeamSchema } from '../dto/team/update.team';
import teamController from '../controllers/team';
import { Role } from '@prisma/client';

const teamRouter = Router();

teamRouter.use(authentication('access'));

teamRouter.post(
  '/',
  authorizeRole([Role.ADMIN]),
  validate(createTeamSchema),
  teamController.createTeam
);
teamRouter.get('/', teamController.getTeams);
teamRouter.get('/:id', validateId, teamController.getTeamById);
teamRouter.put(
  '/:id',
  authorizeRole([Role.ADMIN]),
  validateId,
  validate(updateTeamSchema),
  teamController.updateTeam
);
teamRouter.delete(
  '/:id',
  authorizeRole([Role.ADMIN]),
  validateId,
  teamController.deleteTeam
);

export default teamRouter;
