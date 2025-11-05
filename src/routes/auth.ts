import { Router } from 'express';
import authController from '../controllers/auth';
import { registerAuthSchema } from '../dto/auth/register.auth';
import { loginAuthSchema } from '../dto/auth/login.auth';
import { validate } from '../middlewares/validation';

const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerAuthSchema),
  authController.register
);
authRouter.post('/login', validate(loginAuthSchema), authController.login);
export default authRouter;
