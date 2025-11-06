import { Request, Response } from 'express';
import { RegisterAuthDto } from '../dto/auth/register.auth';
import authService from '../services/auth';
import { AppError } from '../utils/appError';
import { LoginAuthDto } from '../dto/auth/login.auth';

class AuthController {
  private handleAuthError = (error: unknown, res: Response) => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  register = async (
    req: Request<Record<string, never>, Record<string, never>, RegisterAuthDto>,
    res: Response
  ) => {
    const { name, email, password } = req.body as RegisterAuthDto;
    try {
      const user = await authService.register({ name, email, password });
      res.status(201).json(user);
    } catch (error: unknown) {
      this.handleAuthError(error, res);
    }
  };
  login = async (
    req: Request<Record<string, never>, Record<string, never>, LoginAuthDto>,
    res: Response
  ) => {
    const { email, password } = req.body as LoginAuthDto;
    try {
      const user = await authService.login({ email, password });
      res.status(200).json(user);
    } catch (error: unknown) {
      this.handleAuthError(error, res);
    }
  };
  logout = async (req: Request, res: Response) => {
    try {
      const user = await authService.logout(req.headers.authorization!);
      res.status(200).json(user);
    } catch (error: unknown) {
      this.handleAuthError(error, res);
    }
  };
  logoutAll = async (req: Request, res: Response) => {
    try {
      const user = await authService.logoutAll(req.headers.authorization!);
      res.status(200).json(user);
    } catch (error: unknown) {
      this.handleAuthError(error, res);
    }
  };
  refresh = async (req: Request, res: Response) => {
    try {
      const user = await authService.refresh(req.headers.authorization!);
      res.status(200).json(user);
    } catch (error: unknown) {
      this.handleAuthError(error, res);
    }
  };
}

const authController = new AuthController();
export default authController;
