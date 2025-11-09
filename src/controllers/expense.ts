import { Request, Response } from 'express';
import { AppError } from '../utils/appError';
import expenseService from '../services/expense';
import { CreateExpenseDto } from '../dto/expense/create.expense';

class ExpenseController {
  async createExpense(
    req: Request<{ id: string }, Record<string, never>, CreateExpenseDto>,
    res: Response
  ) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const expense = await expenseService.createExpense(id, userId, req.body);
      res.status(201).json(expense);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}

const expenseController = new ExpenseController();
export default expenseController;
