import { Request, Response } from 'express';
import { RegisterAuthDto } from '../dto/auth/register.auth';
import authService from '../services/auth';
import { AppError } from '../utils/appError';

export class AuthController {
  async register(
    req: Request<Record<string, never>, Record<string, never>, RegisterAuthDto>,
    res: Response
  ) {
    const { name, email, password } = req.body as RegisterAuthDto;
    try {
      const user = await authService.register({ name, email, password });
      res.status(201).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}
