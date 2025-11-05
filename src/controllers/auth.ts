import { Request, Response } from 'express';
import { RegisterAuthDto } from '../dto/auth/register.auth';
import authService from '../services/auth';
import { AppError } from '../utils/appError';

class AuthController {
  async register(
    req: Request<Record<string, never>, Record<string, never>, RegisterAuthDto>,
    res: Response
  ) {
    if (Object.keys(req.body).length === 0) {
      res
        .status(400)
        .json({ message: 'Please provide all the required fields' });
      return;
    }
    const { name, email, password } = req.body as RegisterAuthDto;
    if (!email.includes('@')) {
      res.status(400).json({ message: 'Please provide a valid email' });
      return;
    }
    try {
      const user = await authService.register({ name, email, password });
      res.status(201).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}

const authController = new AuthController();
export default authController;
