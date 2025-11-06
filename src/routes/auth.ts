import { Router } from 'express';
import authController from '../controllers/auth';
import { registerAuthSchema } from '../dto/auth/register.auth';
import { loginAuthSchema } from '../dto/auth/login.auth';
import { validate } from '../middlewares/validation';
import authentication from '../middlewares/authentication';
const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerAuthSchema),
  authController.register
);
authRouter.post('/login', validate(loginAuthSchema), authController.login);
authRouter.post('/refresh', authentication('refresh'), authController.refresh);
authRouter.post('/logout', authentication('refresh'), authController.logout);
authRouter.post(
  '/logout-all',
  authentication('refresh'),
  authController.logoutAll
);
export default authRouter;
