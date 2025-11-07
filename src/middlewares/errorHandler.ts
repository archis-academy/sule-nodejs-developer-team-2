import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Something went wrong.';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = `Validation Error: ${error.issues.map((e) => e.message).join(', ')}`;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    switch (error.code) {
      case 'P2002':
        message = 'Duplicate field value: This record already exists.';
        statusCode = 409;
        break;
      case 'P2025':
        message = 'Record not found.';
        statusCode = 404;
        break;
      default:
        message = `Database Error: ${error.message}`;
        break;
    }
  } else if (error instanceof Error) {
    message = 'An unexpected error occurred.';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
  });
};

export default errorHandler;
