import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

export enum ValidationType {
  BODY = 'body',
  PARAMS = 'params',
  QUERY = 'query',
}

export const validate = (
  schema: z.ZodTypeAny,
  type: ValidationType = ValidationType.BODY
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[type];

      const validatedData = schema.parse(dataToValidate);

      req[type] = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.issues.map((e) => e.message) });
      }
      next(error);
      // global error handler will catch this error
    }
  };
};

export const validateBody = (schema: z.ZodTypeAny) =>
  validate(schema, ValidationType.BODY);

export const validateParams = (schema: z.ZodTypeAny) =>
  validate(schema, ValidationType.PARAMS);

export const validateQuery = (schema: z.ZodTypeAny) =>
  validate(schema, ValidationType.QUERY);

export const validateId = validate(
  z.object({
    id: z
      .string()
      .regex(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
        'A valid UUID format is required'
      ),
  }),
  ValidationType.PARAMS
);
