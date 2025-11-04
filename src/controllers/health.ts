import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
  console.log('getHealth');
  res.status(200).json({ message: 'ok' });
};
