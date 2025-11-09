import { Router } from 'express';
import authentication from '../middlewares/authentication';
import authorizeRole from '../middlewares/authorization';
import authorizeMember from '../middlewares/authorizeMember';
import { validateBody, validateId } from '../middlewares/validation';
import { createTeamSchema } from '../dto/team/create.team';
import { createTeamMemberSchema } from '../dto/team/create.team-member';
import { updateTeamSchema } from '../dto/team/update.team';
import teamController from '../controllers/team';
import categoryController from '../controllers/category';
import expenseController from '../controllers/expense';
import { Role } from '@prisma/client';
import { UpdateCategorySchema } from '../dto/category/update.category';
import { CreateCategorySchema } from '../dto/category/create.category';
import { CreateExpenseSchema } from '../dto/expense/create.expense';

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
teamRouter.post(
  '/:id/categories',
  authorizeRole([Role.ADMIN]),
  validateId('id'),
  validateBody(CreateCategorySchema),
  categoryController.createCategory
);
teamRouter.get(
  '/:id/categories',
  validateId('id'),
  categoryController.getTeamCategories
);
teamRouter.put(
  '/:id/categories/:categoryId',
  authorizeRole([Role.ADMIN]),
  validateId('id', 'categoryId'),
  validateBody(UpdateCategorySchema),
  categoryController.updateCategory
);
teamRouter.delete(
  '/:id/categories/:categoryId',
  authorizeRole([Role.ADMIN]),
  validateId('id', 'categoryId'),
  categoryController.deleteCategory
);
teamRouter.post(
  '/:id/expenses',
  validateId('id'),
  authorizeMember('id'),
  validateBody(CreateExpenseSchema),
  expenseController.createExpense
);
teamRouter.get(
  '/:id/expenses',
  validateId('id'),
  authorizeMember('id'),
  expenseController.getExpenses
);

export default teamRouter;
