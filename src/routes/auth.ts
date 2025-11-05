import { Router } from 'express';
import authController from '../controllers/auth';

const authRouter = Router();

authRouter.post('/v1/register', authController.register);

export default authRouter;
