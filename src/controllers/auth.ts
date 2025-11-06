import { Request, Response } from 'express';
import { RegisterAuthDto } from '../dto/auth/register.auth';
import authService from '../services/auth';
import { AppError } from '../utils/appError';
import { LoginAuthDto } from '../dto/auth/login.auth';

class AuthController {
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
        return;
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
  async login(
    req: Request<Record<string, never>, Record<string, never>, LoginAuthDto>,
    res: Response
  ) {
    const { email, password } = req.body as LoginAuthDto;
    try {
      const user = await authService.login({ email, password });
      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
  async logout(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new AppError('Authorization header is missing', 401);
      }
      const user = await authService.logout(authorization);
      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
  async logoutAll(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new AppError('Authorization header is missing', 401);
      }
      const user = await authService.logoutAll(authorization);
      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
  async refresh(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new AppError('Authorization header is missing', 401);
      }
      const user = await authService.refresh(authorization);
      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}

const authController = new AuthController();
export default authController;
